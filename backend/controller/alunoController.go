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
		c.JSON(http.StatusUnauthorized, gin.H{"error": "RM inválido"})
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

// Cadastrar um aluno novo no banco
func CadastrarAluno(c *gin.Context) {
	var create model.AlunoCreate
	if err := c.ShouldBindJSON(&create); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos", "details": err.Error()})
		return
	}

	//Verifica se o RM já existe
	var count int64
	config.DB.Model(&model.Aluno{}).Where("rm = ?", create.RM).Count(&count)
	if count > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "RM já cadastrado"})
		return
	}

	//Hash da senha
	hashed := utils.HashSHA256(create.Senha)

	aluno := model.Aluno{
		RM:    create.RM,
		Nome:  create.Nome,
		Serie: create.Serie,
		Saldo: create.Saldo,
		Senha: hashed,
	}

	if err := config.DB.Create(&aluno).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao criar aluno"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"aluno": aluno.ToResponse()})
}

func GetPerfilAluno(c *gin.Context) {
	//Pega o userID setado pelo middleware
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		return
	}

	rm := int(userID.(uint))

	var aluno model.Aluno
	if err := config.DB.Where("rm = ?", rm).First(&aluno).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuário não encontrado"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"aluno": aluno.ToResponse()})
}
