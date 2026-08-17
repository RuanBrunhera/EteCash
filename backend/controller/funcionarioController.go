package controller

import (
	"net/http"
	"time"

	"github.com/RuanBrunhera/Etecash/config"
	"github.com/RuanBrunhera/Etecash/model"
	"github.com/RuanBrunhera/Etecash/utils"
	"github.com/gin-gonic/gin"
)

func GetPerfilFuncionario(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		return
	}

	id := userID.(uint64)

	var funcionario model.Funcionario
	if err := config.DB.Where("id = ?", id).First(&funcionario).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Funcionário não encontrado"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"funcionario": funcionario.ToResponse()})
}

func LoginFuncionario(c *gin.Context) {
	var login model.FuncionarioLogin
	if err := c.ShouldBindJSON(&login); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Dados inválidos",
			"details": err.Error(),
		})
		return
	}

	//Busca o funcionário pelo telefone
	var funcionario model.Funcionario
	if err := config.DB.Where("cpf = ?", login.CPF).First(&funcionario).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "CPF inválido",
		})
		return
	}

	//Verifica a senha
	if !utils.CheckPasswordHash(login.Senha, funcionario.Senha) {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Senha inválida",
		})
		return
	}

	//Gera o token JWT
	token, err := utils.GenerateToken(uint64(funcionario.ID), "funcionario", 24*time.Hour)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Erro ao gerar token JWT",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token":       token,
		"funcionario": funcionario.ToResponse(),
	})
}

func AtualizarPerfilFuncionario(c *gin.Context) {
	// TODO 1: extrair userID do contexto, 401 com return se !exists
	//         (repara: aqui não precisa de cast pra int64 como no aluno,
	//         GetPerfilFuncionario usa direto userID.(uint64) — segue esse padrão)

	// TODO 2: bind do JSON pro model.FuncionarioUpdate, 400 com return se erro

	// TODO 3: buscar o Funcionario no banco pelo ID, 404 com return se não achar

	// TODO 4: aplicar os campos que vieram preenchidos (não-nil) no funcionário
	//         pensa: como você sabe se um campo *string veio ou não veio na
	//         requisição? (dica: é exatamente o motivo de ser ponteiro —
	//         compara com nil antes de aplicar, campo por campo)
	//         ex: if update.Nome != nil { funcionario.Nome = *update.Nome }

	// TODO 5: salvar com Save(), 500 com return se erro

	// TODO 6: retornar 200 com funcionario.ToResponse() atualizado
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		return
	}

	id := userID.(uint64)

	var update model.FuncionarioUpdate
	if err := c.ShouldBindJSON(&update); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Dados inválidos",
			"details": err.Error(),
		})
		return
	}

	var funcionario model.Funcionario
	if err := config.DB.Where("id = ?", id).First(&funcionario).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Funcionário não encontrado"})
		return
	}

	if update.Nome != nil {
		funcionario.Nome = *update.Nome
	}

	if update.Email != nil {
		funcionario.Email = update.Email
	}

	if update.DataNasc != nil {
		funcionario.DataNasc = update.DataNasc
	}

	if update.Telefone != nil {
		funcionario.Telefone = update.Telefone
	}

	if err := config.DB.Save(&funcionario).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar perfil do funcionário"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"funcionario": funcionario.ToResponse()})
}

func AtualizarSenhaFuncionario(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		return
	}

	id := userID.(uint64)

	var update model.FuncionarioAtualizarSenha
	if err := c.ShouldBindJSON(&update); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos", "details": err.Error()})
		return
	}

	if update.NovaSenha != update.ConfirmarSenhaNova {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "As senhas não conferem"})
		return
	}

	var funcionario model.Funcionario
	if err := config.DB.Where("id = ?", id).First(&funcionario).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuário não encontrado"})
		return
	}

	if !utils.CheckPasswordHash(update.SenhaAtual, funcionario.Senha) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Senha atual incorreta"})
		return
	}

	if update.SenhaAtual == update.NovaSenha {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "Senha nova é igual à senha atual"})
		return
	}

	funcionario.Senha = utils.HashSHA256(update.NovaSenha)
	if err := config.DB.Save(&funcionario).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar senha"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Senha atualizada com sucesso"})

}
