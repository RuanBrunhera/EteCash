package model

import "time"

type Historico struct {
	ID             uint      `json:"id"              gorm:"primaryKey"`
	AlunoRM        int       `json:"aluno_rm"        gorm:"not null;column:aluno_rm"`
	Tipo           string    `json:"tipo"            gorm:"type:tipo_pagamento;not null"`
	FormaPagamento string    `json:"forma_pagamento" gorm:"type:forma_pagamento;not null"`
	Valor          float64   `json:"valor"           gorm:"type:numeric(10,2);not null"`
	DataHora       time.Time `json:"data_hora"       gorm:"column:data_hora;default:CURRENT_TIMESTAMP"`
}

func (Historico) TableName() string {
	return "historico"
}

type HistoricoCreate struct {
	AlunoRM        int     `json:"aluno_rm"        validate:"required"`
	Tipo           string  `json:"tipo"            validate:"required,oneof=credito debito"`
	FormaPagamento string  `json:"forma_pagamento" validate:"required,oneof=pix boleto saldo"`
	Valor          float64 `json:"valor"           validate:"required,gt=0"`
}

type HistoricoResponse struct {
	ID             uint      `json:"id"`
	AlunoRM        int       `json:"aluno_rm"`
	Tipo           string    `json:"tipo"`
	FormaPagamento string    `json:"forma_pagamento"`
	Valor          float64   `json:"valor"`
	DataHora       time.Time `json:"data_hora"`
}
