package model

import "time"

type Funcionario struct {
	ID        uint       `json:"id"         gorm:"primaryKey"`
	Nome      string     `json:"nome"       gorm:"not null;column:nome"      validate:"required,min=3,max=100"`
	DataNasc  *time.Time `json:"data_nasc"  gorm:"column:data_nasc"`
	Telefone  *string    `json:"telefone"   gorm:"column:telefone"            validate:"omitempty,min=10,max=20"`
	Senha     string     `json:"-"          gorm:"not null;column:senha"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
}

func (Funcionario) TableName() string {
	return "funcionario"
}

type FuncionarioCreate struct {
	Nome     string     `json:"nome" validate:"required,min=3,max=100"`
	DataNasc *time.Time `json:"data_nasc"`
	Telefone *string    `json:"telefone" validate:"omitempty,min=10,max=20"`
	Senha    string     `json:"senha" validate:"required,min=6"`
}

type FuncionarioUpdate struct {
	Nome     *string    `json:"nome" validate:"omitempty,min=3,max=100"`
	DataNasc *time.Time `json:"data_nasc"`
	Telefone *string    `json:"telefone" validate:"omitempty,min=10,max=20"`
	Senha    *string    `json:"senha" validate:"omitempty,min=6"`
}

type FuncionarioResponse struct {
	ID        uint       `json:"id"`
	Nome      string     `json:"nome"`
	DataNasc  *time.Time `json:"data_nasc,omitempty"`
	Telefone  *string    `json:"telefone,omitempty"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
}

type FuncionarioLogin struct {
	Telefone string `json:"telefone" validate:"required,min=10,max=20"`
	Senha    string `json:"senha" validate:"required,min=6"`
}

func (f *Funcionario) ToResponse() FuncionarioResponse {
	return FuncionarioResponse{
		ID:			f.ID,
		Nome:		f.Nome,
		DataNasc:	f.DataNasc,
		Telefone:	f.Telefone,
		CreatedAt: 	f.CreatedAt,
		UpdatedAt: 	f.UpdatedAt,
	}
}