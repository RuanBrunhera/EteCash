package controller

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/RuanBrunhera/Etecash/config"
	"github.com/RuanBrunhera/Etecash/model"
	"github.com/RuanBrunhera/Etecash/utils"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// Erros sentinela: variáveis fixas que representam situações de negócio específicas,
// permitindo identificar exatamente qual regra falhou (em vez de comparar strings de texto)

var ErrEstoqueInsuficiente = errors.New("estoque insuficiente")
var ErrSaldoInsuficiente = errors.New("saldo insuficiente")

func EfetuarTransacao(c *gin.Context) {
	
	// TODO 1: c.Get("userID") — se não existir, 401 e return
	// TODO 2: type assertion pra uint64 — se falhar, 500 e return
	// TODO 3: converta pra uint (tipo que Transacao.FuncionarioID espera),
	// guarde numa variável tipo `funcionarioID`
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		return
	}

	userIDUint, ok := userID.(uint64)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ID do usuário inválido"})
		return
	}

	funcionarioID := uint(userIDUint)

	// 1 Faz o bind do JSON pro model.TransacaoCreate
	var create model.TransacaoCreate
	if err := c.ShouldBindJSON(&create); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos", "details": err.Error()})
		return
	}


	// 2 Busca o aluno pelo RM e verifica o PIN
	var aluno model.Aluno
	if err := config.DB.Preload("Curso").Where("rm = ?", create.AlunoRM).First(&aluno).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "RM inválido"})
		return
	}

	if !utils.CheckPINHash(create.AlunoPIN, aluno.PIN) {
		c.JSON(http.StatusForbidden, gin.H{"error": "PIN inválido"})
		return
	}

	// 3 Dentro de config.DB.Transaction(func(tx *gorm.DB) error { ... }): itera pelos itens, busca cada produto, valida estoque, soma o total
	var valorTotal float64

	err := config.DB.Transaction(func(tx *gorm.DB) error {
		for _, item := range create.Itens {
			var produto model.Produto
			if err := tx.Where("id = ?", item.ProdutoID).First(&produto).Error; err != nil {
				return err
			}
			valorTotal += produto.Preco * float64(item.Quantidade)
		}
		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao processar itens da compra"})
		return
	}

	// 4 Valida saldo suficiente
	if aluno.Saldo < valorTotal {
		err := ErrSaldoInsuficiente
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// 5. Debita saldo, diminui estoque, cria Transacao + ItemTransacao, cria Historico
	var transacao model.Transacao

	err = config.DB.Transaction(func(tx *gorm.DB) error {
		// 5.1 — Debita o saldo do aluno
		aluno.Saldo -= valorTotal
		if err := tx.Save(&aluno).Error; err != nil {
			return err
		}

		// 5.2 — Cria o registro de Transacao (ainda sem os itens)
		transacao = model.Transacao{
			AlunoRM:       aluno.RM,
			FuncionarioID: funcionarioID,
			ValorTotal:    valorTotal,
		}
		if err := tx.Create(&transacao).Error; err != nil {
			return err
		}

		// 5.3 — Para cada item do carrinho:
		//   a) buscar o produto de novo (dentro da transação, usando `tx`)

		for _, item := range create.Itens {
			var produto model.Produto

			if err := tx.Where("id = ?", item.ProdutoID).First(&produto).Error; err != nil {
				return err
			}

			//   b) verificar se `produto.Estoque >= item.Quantidade` (senão, retornar erro)
			if produto.Estoque < item.Quantidade {
				return fmt.Errorf("%w: %s", ErrEstoqueInsuficiente, produto.Nome)
			}

			//   c) diminuir `produto.Estoque` e salvar com `tx.Save(&produto)`
			produto.Estoque -= item.Quantidade
			if err := tx.Save(&produto).Error; err != nil {
				return err
			}

			//   d) criar o ItemTransacao correspondente (TransacaoID, ProdutoID, Quantidade, PrecoUnitario)
			itemTransacao := model.ItemTransacao{
				TransacaoID:   transacao.ID,
				ProdutoID:     produto.ID,
				Quantidade:    item.Quantidade,
				PrecoUnitario: produto.Preco,
			}
			if err := tx.Create(&itemTransacao).Error; err != nil {
				return err
			}
		}

		// 5.4 — Cria o registro em Historico (tipo "debito", forma_pagamento "saldo")
		historico := model.Historico{
			AlunoRM:        aluno.RM,
			Tipo:           "debito",
			FormaPagamento: "saldo",
			Valor:          valorTotal,
		}
		if err := tx.Create(&historico).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		switch {
		case errors.Is(err, ErrEstoqueInsuficiente):
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		case errors.Is(err, ErrSaldoInsuficiente):
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao processar a compra", "details": err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Transação realizada com sucesso",
		"transacao": gin.H{
			"id":             transacao.ID,
			"aluno_rm":       transacao.AlunoRM,
			"funcionario_id": transacao.FuncionarioID,
			"valor_total":    transacao.ValorTotal,
			"data_hora":      transacao.DataHora,
		},
		"aluno": gin.H{
			"nome":  aluno.Nome,
			"saldo": aluno.Saldo,
		},
	})
}

func AdicionarSaldo(c *gin.Context) {
	var body struct {
		RM             int64   `json:"rm"`
		Valor          float64 `json:"valor"           validate:"required,gt=0"`
		FormaPagamento string  `json:"forma_pagamento" validate:"required,oneof=pix boleto"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos", "details": err.Error()})
		return
	}

	userID, ok := c.Get("userID")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		return
	}

	userIDUint, ok := userID.(uint64)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ID do usuário inválido"})
		return
	}

	rm := body.RM
	userRole, _ := c.Get("userRole")
	if userRole == "aluno" {
		rm = int64(userIDUint)
	}

	if rm == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "RM inválido"})
		return
	}

	var aluno model.Aluno
	if err := config.DB.Preload("Curso").Where("rm = ?", rm).First(&aluno).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuário não encontrado"})
		return
	}

	aluno.Saldo += body.Valor
	if err := config.DB.Save(&aluno).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"eror": "Erro ao atualizar saldo do aluno"})
		return
	}

	historico := model.Historico{
		AlunoRM:        aluno.RM,
		Tipo:           "credito",
		FormaPagamento: body.FormaPagamento,
		Valor:          body.Valor,
	}
	if err := config.DB.Create(&historico).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao registrar histórico"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"aluno": aluno.ToResponse()})
}
