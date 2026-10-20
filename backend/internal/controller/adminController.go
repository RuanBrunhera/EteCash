package controller

import (
	"net/http"
	"strconv"

	"github.com/RuanBrunhera/Etecash/internal/config"
	"github.com/RuanBrunhera/Etecash/internal/model"
	"github.com/gin-gonic/gin"
)

func ListarAlunos(c *gin.Context) {
	var alunos []model.Aluno
	if err := config.DB.Preload("Curso").Order("nome").Find(&alunos).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar alunos"})
		return
	}

	resultado := make([]model.AlunoResponse, 0, len(alunos))
	for i := range alunos {
		resultado = append(resultado, alunos[i].ToResponse())
	}

	c.JSON(http.StatusOK, gin.H{"alunos": resultado})
}

func AlterarStatusAluno(c *gin.Context) {
	rm, err := strconv.ParseInt(c.Param("rm"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "RM inválido"})
		return
	}

	var body struct {
		Ativo *bool `json:"ativo"`
	}
	if err := c.ShouldBindJSON(&body); err != nil || body.Ativo == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Informe o campo ativo"})
		return
	}

	// Update("ativo", ...) e não Updates(struct): o GORM ignora false em struct
	resultado := config.DB.Model(&model.Aluno{}).Where("rm = ?", rm).Update("ativo", *body.Ativo)
	if resultado.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar aluno"})
		return
	}
	if resultado.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Aluno não encontrado"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Status do aluno atualizado"})
}

func ListarFuncionarios(c *gin.Context) {
	var funcionarios []model.Funcionario
	if err := config.DB.Order("nome").Find(&funcionarios).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar funcionários"})
		return
	}

	resultado := make([]model.FuncionarioResponse, 0, len(funcionarios))
	for i := range funcionarios {
		resultado = append(resultado, funcionarios[i].ToResponse())
	}

	c.JSON(http.StatusOK, gin.H{"funcionarios": resultado})
}

func AlterarStatusFuncionario(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	var body struct {
		Ativo *bool `json:"ativo"`
	}
	if err := c.ShouldBindJSON(&body); err != nil || body.Ativo == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Informe o campo ativo"})
		return
	}

	// o admin não pode se desativar, senão se tranca fora do sistema
	if userID, ok := c.Get("userID"); ok {
		if uid, ok := userID.(uint64); ok && uid == id && !*body.Ativo {
			c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "Você não pode desativar a própria conta"})
			return
		}
	}

	resultado := config.DB.Model(&model.Funcionario{}).Where("id = ?", id).Update("ativo", *body.Ativo)
	if resultado.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar funcionário"})
		return
	}
	if resultado.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Funcionário não encontrado"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Status do funcionário atualizado"})
}
