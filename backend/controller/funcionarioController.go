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

	// Decide a role com base em funcionario.IsAdmin
	role := "funcionario"
	if funcionario.IsAdmin {
		role = "admin"
	}

	//Gera o token JWT
	token, err := utils.GenerateToken(uint64(funcionario.ID), role, 24*time.Hour)
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
