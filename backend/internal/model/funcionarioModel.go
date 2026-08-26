package model

import "time"

type Funcionario struct {
	ID        uint       `json:"id"         gorm:"primaryKey"`
	Nome      string     `json:"nome"       gorm:"not null;column:nome"      validate:"required,min=3,max=100"`
	CPF       string     `json:"cpf"        gorm:"not null;unique;column:cpf" validate:"required,len=11"`
	Email     *string    `json:"email"      gorm:"column:email"               validate:"omitempty,email"`
	DataNasc  *time.Time `json:"data_nasc"  gorm:"column:data_nasc"`
	Telefone  *string    `json:"telefone"   gorm:"column:telefone"            validate:"omitempty,min=10,max=20"`
	Senha     string     `json:"-"          gorm:"not null;column:senha"`
	IsAdmin   bool       `json:"-"          gorm:"not null;column:is_admin;default:false"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
}

func (Funcionario) TableName() string {
	return "funcionario"
}

type FuncionarioCreate struct {
	Nome     string     `json:"nome" validate:"required,min=3,max=100"`
	CPF      string     `json:"cpf" validate:"required,len=11"`
	Email    *string    `json:"email" validate:"omitempty,email"`
	DataNasc *time.Time `json:"data_nasc"`
	Telefone *string    `json:"telefone" validate:"omitempty,min=10,max=20"`
}

type FuncionarioUpdate struct {
	Nome     *string    `json:"nome" validate:"omitempty,min=3,max=100"`
	Email    *string    `json:"email" validate:"omitempty,email"`
	DataNasc *time.Time `json:"data_nasc"`
	Telefone *string    `json:"telefone" validate:"omitempty,min=10,max=20"`
}

type FuncionarioAtualizarSenha struct {
	SenhaAtual         string `json:"senhaAtual"`
	NovaSenha          string `json:"novaSenha"`
	ConfirmarSenhaNova string `json:"confirmarSenhaNova"`
}

type FuncionarioResponse struct {
	ID        uint       `json:"id"`
	Nome      string     `json:"nome"`
	CPF       string     `json:"cpf"`
	Email     *string    `json:"email,omitempty"`
	DataNasc  *time.Time `json:"data_nasc,omitempty"`
	Telefone  *string    `json:"telefone,omitempty"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
}

type FuncionarioCadastroResponse struct {
	ID        uint       `json:"id"`
	Nome      string     `json:"nome"`
	CPF       string     `json:"cpf"`
	Email     *string    `json:"email"`
	Telefone  *string    `json:"telefone"`
	DataNasc  *time.Time `json:"data_nasc"`
	SenhaTemp string     `json:"senha_temp"`
}

type FuncionarioLogin struct {
	CPF   string `json:"cpf" validate:"required,len=11"`
	Senha string `json:"senha" validate:"required,min=6"`
}

func (f *Funcionario) ToResponse() FuncionarioResponse {
	return FuncionarioResponse{
		ID:        f.ID,
		Nome:      f.Nome,
		CPF:       f.CPF,
		Email:     f.Email,
		DataNasc:  f.DataNasc,
		Telefone:  f.Telefone,
		CreatedAt: f.CreatedAt,
		UpdatedAt: f.UpdatedAt,
	}
}
