package controller

import (
	"net/http"

	"github.com/RuanBrunhera/Etecash/config"
	"github.com/RuanBrunhera/Etecash/model"
	"github.com/gin-gonic/gin"
)

func GetHistoricoAluno(c *gin.Context) {
	userID, ok := c.Get("userID")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		return
	}

	rm := int(userID.(uint))

	var historico []model.Historico
	if err := config.DB.Where("aluno_rm = ?", rm).Order("data_hora DESC").Find(&historico).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar histórico"})
		return
	}

	var response []model.HistoricoResponse
	for _, h := range historico {
		response = append(response, model.HistoricoResponse{
			ID:             h.ID,
			AlunoRM:        h.AlunoRM,
			Tipo:           h.Tipo,
			FormaPagamento: h.FormaPagamento,
			Valor:          h.Valor,
			DataHora:       h.DataHora,
		})
	}

	c.JSON(http.StatusOK, gin.H{"historico": response})
}
