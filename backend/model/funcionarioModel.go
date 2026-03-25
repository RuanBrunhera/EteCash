package model

import "time"

type Funcionario struct {
	ID       uint       `json:"id"         gorm:"primaryKey"`
	Nome     string     `json:"nome"       gorm:"not null;column:nome"      validate:"required,min=3,max=100"`
	DataNasc *time.Time `json:"data_nasc"  gorm:"column:data_nasc"`
	Telefone *string    `json:"telefone"   gorm:"column:telefone"            validate:"omitempty,min=10,max=20"`
}
