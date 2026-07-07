package controller

import (
	"net/http"
	"time"

	"github.com/RuanBrunhera/Etecash/config"
	"github.com/RuanBrunhera/Etecash/model"
	"github.com/RuanBrunhera/Etecash/utils"
	"github.com/gin-gonic/gin"
)

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
	if err := config.DB.Where("telefone = ?", login.Telefone).First(&funcionario).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Telefone inválido",
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
	token, err := utils.GenerateToken(funcionario.ID, "funcionario", 24*time.Hour)
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
