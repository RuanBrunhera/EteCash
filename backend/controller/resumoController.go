package controller

import (
	"net/http"

	"github.com/RuanBrunhera/Etecash/config"
	"github.com/RuanBrunhera/Etecash/model"
	"github.com/gin-gonic/gin"
)

func GetResumoDia(c *gin.Context) {
	var totais struct {
		Faturamento  float64
		NumeroVendas int64
	}

	config.DB.Model(&model.Transacao{}).
		Where("data_hora::date = CURRENT_DATE").
		Select("COALESCE(SUM(valor_total), 0) as faturamento, COUNT(*) as numero_vendas").
		Scan(&totais)

	var maisVendido struct {
		Nome string
	}

	config.DB.Table("item_transacao").
		Select("produto.nome as nome").
		Joins("JOIN transacao ON transacao.id = item_transacao.transacao_id").
		Joins("JOIN produto ON produto.id = item_transacao.produto_id").
		Where("transcao.data_hora::date = CURRENT_DATE").
		Group("produto.nome").
		Order("SUM(item_transacao.quantidade) DESC").
		Limit(1).
		Scan(&maisVendido)

	produtoMaisVendido := maisVendido.Nome
	if produtoMaisVendido == "" {
		produtoMaisVendido = "-"
	}

	c.JSON(http.StatusOK, gin.H{
		"faturamento":          totais.Faturamento,
		"numero_vendas":        totais.NumeroVendas,
		"produto_mais_vendido": produtoMaisVendido,
	})
}
