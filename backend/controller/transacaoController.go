package controller

import (
	"net/http"

	"github.com/RuanBrunhera/Etecash/config"
	"github.com/RuanBrunhera/Etecash/model"
	"github.com/gin-gonic/gin"
)

func EfetuarTransacao(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"message": "Em desenvolvimento"})
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
