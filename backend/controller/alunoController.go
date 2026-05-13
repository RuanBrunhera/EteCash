package controller

import (
	"net/http"
	"time"

	"github.com/RuanBrunhera/Etecash/config"
	"github.com/RuanBrunhera/Etecash/model"
	"github.com/RuanBrunhera/Etecash/utils"
	"github.com/gin-gonic/gin"
)

func LoginAluno(c *gin.Context) {
	var login model.AlunoLogin
	if err := c.ShouldBindJSON(&login); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos", "details": err.Error()})
		return
	}

	// Busca o aluno pelo RM
	var aluno model.Aluno
	if err := config.DB.Where("rm = ?", login.RM).First(&aluno).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "RM ou senha inválidos"})
		return
	}

	// Verifica a senha
	if !utils.CheckPasswordHash(login.Senha, aluno.Senha) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "RM ou senha inválidos"})
		return
	}

	// Gera o token JWT
	token, err := utils.GenerateToken(uint(aluno.RM), "aluno", 24*time.Hour)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao gerar token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"aluno": aluno.ToResponse(),
	})
}