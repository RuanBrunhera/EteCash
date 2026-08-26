package controller

import (
	"net/http"
	"strconv"
	"time"

	"github.com/RuanBrunhera/Etecash/internal/config"
	"github.com/RuanBrunhera/Etecash/internal/model"
	"github.com/RuanBrunhera/Etecash/internal/security"
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
	if err := config.DB.Preload("Curso").Where("rm = ?", login.RM).First(&aluno).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "RM inválido"})
		return
	}

	// Verifica a senha
	if !security.CheckPasswordHash(login.Senha, aluno.Senha) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "RM ou senha inválidos"})
		return
	}

	// Gera o token JWT
	token, err := security.GenerateToken(uint64(aluno.RM), "aluno", 24*time.Hour)
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

	// Verifica se o RM já existe
	var count int64
	config.DB.Model(&model.Aluno{}).Where("rm = ?", create.RM).Count(&count)
	if count > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "RM já cadastrado"})
		return
	}

	// Verifica se o curso_id existe e está ativo
	var curso model.Curso
	if err := config.DB.Where("id = ? AND ativo = ?", create.CursoID, true).First(&curso).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Curso inválido ou indisponível"})
		return
	}

	// Cria hash do PIN do aluno
	pinGerado := security.GerarPin()
	hashedPin := security.HashSHA256(pinGerado)

	// Hash da senha
	hashed := security.HashSHA256(create.Senha)

	aluno := model.Aluno{
		RM:      create.RM,
		Nome:    create.Nome,
		Serie:   create.Serie,
		CursoID: create.CursoID,
		Saldo:   create.Saldo,
		Senha:   hashed,
		PIN:     hashedPin,
	}

	if err := config.DB.Create(&aluno).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao criar aluno"})
		return
	}

	resposta := model.AlunoCadastroResponse{
		RM:        aluno.RM,
		Nome:      aluno.Nome,
		Serie:     aluno.Serie,
		Curso:     curso,
		Saldo:     aluno.Saldo,
		PIN:       pinGerado,
		CreatedAt: aluno.CreatedAt,
		UpdatedAt: aluno.UpdatedAt,
	}
	c.JSON(http.StatusCreated, gin.H{"aluno": resposta})
}

func GetPerfilAluno(c *gin.Context) {
	//Pega o userID setado pelo middleware
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		return
	}

	rm := int64(userID.(uint64))

	var aluno model.Aluno
	if err := config.DB.Preload("Curso").Where("rm = ?", rm).First(&aluno).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuário não encontrado"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"aluno": aluno.ToResponse()})
}

func BuscarAlunoPorRM(c *gin.Context) {
	rmStr := c.Param("rm")
	rm, err := strconv.ParseUint(rmStr, 10, 64)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "RM inválido"})
		return
	}

	var aluno model.Aluno
	if err := config.DB.Where("rm = ?", rm).First(&aluno).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Aluno não encontrado"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"aluno": aluno.ToBuscaRmResponse()})
}

func AtualizarSenhaAluno(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		return
	}

	rm := int64(userID.(uint64))

	var update model.AlunoAtualizarSenha
	if err := c.ShouldBindJSON(&update); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos", "details": err.Error()})
		return
	}

	if update.NovaSenha != update.ConfirmarSenhaNova {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "As senhas não conferem"})
		return
	}

	var aluno model.Aluno
	if err := config.DB.Where("rm = ?", rm).First(&aluno).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuário não encontrado"})
		return
	}

	if !security.CheckPasswordHash(update.SenhaAtual, aluno.Senha) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Senha atual incorreta"})
		return
	}

	if update.SenhaAtual == update.NovaSenha {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "Senha nova é igual à senha atual"})
		return
	}

	aluno.Senha = security.HashSHA256(update.NovaSenha)
	if err := config.DB.Save(&aluno).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar senha"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Senha atualizada com sucesso"})

}

func AtualizarPINAluno(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		return
	}

	rm := int64(userID.(uint64))

	var update model.AlunoAtualizarPIN
	if err := c.ShouldBindJSON(&update); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos", "details": err.Error()})
		return
	}

	if update.NovoPIN != update.ConfirmarNovoPIN {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "Os códigos PIN não conferem"})
		return
	}

	var aluno model.Aluno
	if err := config.DB.Where("rm = ?", rm).First(&aluno).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuário não encontrado"})
		return
	}

	if !security.CheckPINHash(update.PINAtual, aluno.PIN) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "PIN atual incorreto"})
		return
	}

	if update.PINAtual == update.NovoPIN {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "PIN novo é igual ao PIN atual"})
		return
	}

	aluno.PIN = security.HashSHA256(update.NovoPIN)
	if err := config.DB.Save(&aluno).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar PIN"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "PIN atualizado com sucesso"})
}
