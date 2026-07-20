package controller

import (
	"net/http"

	"github.com/RuanBrunhera/Etecash/config"
	"github.com/RuanBrunhera/Etecash/model"
	"github.com/gin-gonic/gin"
)

// Lista os cursos disponíveis (ativos) para cadastro do aluno
func ListarCursos(c *gin.Context) {
	var cursos []model.Curso
	if err := config.DB.Where("ativo = ?", true).Find(&cursos).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar cursos disponíveis"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"cursos": cursos})
}
