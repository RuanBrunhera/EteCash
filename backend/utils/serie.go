package utils

import "time"

// CalcularSerieEsperada deriva a série (1, 2 ou 3) a partir do RM,
// assumindo formato AAAA + código instituição + inscrição.
// Retorna 0 se o aluno já deveria ter se formado (série > 3).

func CalcularSerieEsperada(rm int) int {
	anoIngresso := rm / 100_000_00 // pega os 4 primeiros dígitos do RM que é o ano que o aluno entrou na ETEC

	agora := time.Now()
	anoLetivo := agora.Year()
	//O ano letivo só vira quando bate Fevereiro, então Janeiro ainda conta como o ano anterior
	if agora.Month() == time.January {
		anoLetivo--
	}

	serie := anoLetivo - anoIngresso + 1

	if serie < 1 || serie > 3 {
		return 0 //fora da faixa esperada do ano 1º, 2º ou 3º ano
	}
	return serie
}
