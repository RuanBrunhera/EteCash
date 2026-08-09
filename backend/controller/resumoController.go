package controller

import (
	"net/http"
	"time"

	"github.com/RuanBrunhera/Etecash/config"
	"github.com/RuanBrunhera/Etecash/model"
	"github.com/gin-gonic/gin"
)

var mesesPTBR = []string{"Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"}

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
		Where("transacao.data_hora::date = CURRENT_DATE").
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

func GetResumoMensalAluno(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		return
	}

	rm := int64(userID.(uint64))

	var totais struct {
		TotalDepositos float64
		TotalGasto     float64
		NumeroPedidos  int64
	}

	config.DB.Model(&model.Historico{}).
		Where("aluno_rm = ? AND data_hora >= date_trunc('month', CURRENT_DATE) AND data_hora < date_trunc('month', CURRENT_DATE) + interval '1 month'", rm).
		Select("COALESCE(SUM(CASE WHEN tipo = 'credito' THEN valor ELSE 0 END), 0) AS total_depositos, " +
			"COALESCE(SUM(CASE WHEN tipo = 'debito' THEN valor ELSE 0 END), 0) AS total_gasto, " +
			"COALESCE(COUNT(CASE WHEN tipo = 'debito' THEN 1 END), 0) AS numero_pedidos").
		Scan(&totais)

	c.JSON(http.StatusOK, gin.H{
		"totalDepositos": totais.TotalDepositos,
		"totalGasto":     totais.TotalGasto,
		"numeroPedidos":  totais.NumeroPedidos,
	})
}

func GetRelatorioVendas(c *gin.Context) {
	// ===== BLOCO 1: Faturamento por dia da semana atual (seg-sex) =====

	type FaturamentoDia struct {
		Dia   time.Time
		Valor float64
	}
	var faturamentoDiaRaw []FaturamentoDia

	config.DB.Model(&model.Transacao{}).
		Select("data_hora::date AS dia, COALESCE(SUM(valor_total), 0) AS valor").
		Where("data_hora::date >= date_trunc('week', CURRENT_DATE)::date AND data_hora::date <= date_trunc('week', CURRENT_DATE)::date + 4").
		Group("data_hora::date").
		Order("dia").
		Scan(&faturamentoDiaRaw)

	// TODO 1: "preencher os buracos" — gere os 5 dias (seg-sex) da semana atual,
	// e pra cada um, procure se existe em `faturamentoDiaRaw` um valor correspondente.
	// Se existir, usa o valor; se não, usa 0.
	// Dica de estrutura: monte um slice de structs tipo:
	//   type FaturamentoSemanaResponse struct {
	//     Dia   string  `json:"dia"`    // "seg", "ter", etc.
	//     Valor float64 `json:"valor"`
	//   }
	// Pra gerar as datas dos 5 dias, pensa em usar time.Now() e alguma
	// forma de achar a segunda-feira da semana atual em Go (dica: pacote
	// "time" tem Weekday(), que devolve 0=domingo, 1=segunda... você
	// pode calcular quantos dias subtrair de hoje pra chegar na segunda)

	type FaturamentoSemanaResponse struct {
		Dia   string  `json:"dia"`
		Valor float64 `json:"valor"`
	}

	hoje := time.Now()
	diaSemana := int(hoje.Weekday())

	diasParaSegunda := (diaSemana + 6) % 7

	segundaFeira := hoje.AddDate(0, 0, -diasParaSegunda)

	diasDaSemana := []string{"seg", "ter", "qua", "qui", "sex"}
	faturamentoSemanaResponse := make([]FaturamentoSemanaResponse, 0, 5)

	for i := 0; i < 5; i++ {
		dataDia := segundaFeira.AddDate(0, 0, i)
		dataDiaStr := dataDia.Format("2006-01-02")

		valor := 0.0
		for _, item := range faturamentoDiaRaw {
			if item.Dia.Format("2006-01-02") == dataDiaStr {
				valor = item.Valor
				break
			}
		}

		faturamentoSemanaResponse = append(faturamentoSemanaResponse, FaturamentoSemanaResponse{
			Dia:   diasDaSemana[i],
			Valor: valor,
		})

	}

	// ===== BLOCO 2: Faturamento por mês, últimos 6 meses =====

	type FaturamentoMes struct {
		Mes   time.Time
		Valor float64
	}
	var faturamentoMesRaw []FaturamentoMes

	config.DB.Model(&model.Transacao{}).
		Select("date_trunc('month', data_hora) AS mes, COALESCE(SUM(valor_total), 0) AS valor").
		Where("data_hora >= date_trunc('month', CURRENT_DATE) - interval '5 months'").
		Group("date_trunc('month', data_hora)").
		Order("mes").
		Scan(&faturamentoMesRaw)

	// TODO 2: mesmo princípio do TODO 1, mas pra 6 meses.
	// Gere os últimos 6 meses (incluindo o atual), e preencha com o valor
	// encontrado ou 0. Estrutura de resposta similar:
	//   type FaturamentoMesResponse struct {
	//     Mes   string  `json:"mes"`    // "Jan", "Fev", etc.
	//     Valor float64 `json:"valor"`
	//   }

	type FaturamentoMesResponse struct {
		Mes   string  `json:"mes"`
		Valor float64 `json:"valor"`
	}

	faturamentoMesResponse := make([]FaturamentoMesResponse, 0, 6)

	for i := 5; i >= 0; i-- {
		dataMes := time.Date(hoje.Year(), hoje.Month()-time.Month(i), 1, 0, 0, 0, 0, hoje.Location())
		valor := 0.0
		for _, item := range faturamentoMesRaw {
			if item.Mes.Year() == dataMes.Year() && item.Mes.Month() == dataMes.Month() {
				valor = item.Valor
				break
			}
		}
		faturamentoMesResponse = append(faturamentoMesResponse, FaturamentoMesResponse{
			Mes:   mesesPTBR[dataMes.Month()-1],
			Valor: valor,
		})
	}

	// ===== BLOCO 3: Top 10 produtos por quantidade, mês atual =====

	// TODO 3: escreva a query de top produtos (já te dei o SQL equivalente
	// antes — traduza pra GORM, usando .Table("item_transacao"), .Joins(),
	// .Where(), .Group(), .Order(), .Limit(10), .Scan())
	// Struct de destino sugerida:
	//   type TopProduto struct {
	//     Nome       string
	//     Quantidade int
	//   }

	type TopProduto struct {
		Nome       string `json:"nome"`
		Quantidade int    `json:"quantidade"`
	}

	var topProdutos []TopProduto

	config.DB.Table("item_transacao").
		Select("produto.nome AS nome, SUM(item_transacao.quantidade) AS quantidade").
		Joins("JOIN transacao ON transacao.id = item_transacao.transacao_id").
		Joins("JOIN produto ON produto.id = item_transacao.produto_id").
		Where("transacao.data_hora >= date_trunc('month', CURRENT_DATE) AND transacao.data_hora < date_trunc('month', CURRENT_DATE) + interval '1 month'").
		Group("produto.nome").
		Order("quantidade DESC").
		Limit(10).
		Scan(&topProdutos)

	// ===== Resposta final =====

	c.JSON(http.StatusOK, gin.H{
		"faturamento_semana": faturamentoSemanaResponse, // TODO 4: troque pelo resultado do TODO 1
		"faturamento_mensal": faturamentoMesResponse,    // TODO 5: troque pelo resultado do TODO 2
		"top_produtos":       topProdutos,               // TODO 6: troque pelo resultado do TODO 3
	})
}
