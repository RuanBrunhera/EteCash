package controller

import (
	"net/http"
	"time"

	"github.com/RuanBrunhera/Etecash/internal/config"
	"github.com/RuanBrunhera/Etecash/internal/model"
	"github.com/RuanBrunhera/Etecash/internal/security"
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
	if !security.CheckPasswordHash(login.Senha, funcionario.Senha) {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Senha inválida",
		})
		return
	}

	if !funcionario.Ativo {
		c.JSON(http.StatusForbidden, gin.H{"error": "Conta desativada. Procure um administrador."})
		return
	}

	// Decide a role com base em funcionario.IsAdmin
	role := "funcionario"
	if funcionario.IsAdmin {
		role = "admin"
	}

	//Gera o token JWT
	token, err := security.GenerateToken(uint64(funcionario.ID), role, 24*time.Hour)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Erro ao gerar token JWT",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token":       token,
		"role":        role,
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

	if !security.CheckPasswordHash(update.SenhaAtual, funcionario.Senha) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Senha atual incorreta"})
		return
	}

	if update.SenhaAtual == update.NovaSenha {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "Senha nova é igual à senha atual"})
		return
	}

	funcionario.Senha = security.HashSHA256(update.NovaSenha)
	if err := config.DB.Save(&funcionario).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar senha"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Senha atualizada com sucesso"})

}

func CadastrarFuncionario(c *gin.Context) {
	var create model.FuncionarioCreate
	if err := c.ShouldBindJSON(&create); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos", "details": err.Error()})
		return
	}

	var count int64
	if err := config.DB.Model(&model.Funcionario{}).Where("cpf = ?", create.CPF).Count(&count).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao verificar CPF"})
		return
	}
	if count > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "CPF já cadastrado"})
		return
	}
	senhaTemp := security.GerarSenhaTemporaria()
	funcionario := model.Funcionario{
		Nome:     create.Nome,
		CPF:      create.CPF,
		Email:    create.Email,
		DataNasc: create.DataNasc,
		Telefone: create.Telefone,
		Senha:    security.HashSHA256(senhaTemp),
	}

	if err := config.DB.Create(&funcionario).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao criar funcionário"})
		return
	}

	resposta := model.FuncionarioCadastroResponse{
		ID:        funcionario.ID,
		Nome:      funcionario.Nome,
		CPF:       funcionario.CPF,
		Email:     funcionario.Email,
		Telefone:  funcionario.Telefone,
		DataNasc:  funcionario.DataNasc,
		SenhaTemp: senhaTemp,
	}

	c.JSON(http.StatusCreated, gin.H{"funcionario": resposta})
}
