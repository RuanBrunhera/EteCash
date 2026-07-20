package model

import "time"

type Aluno struct {
	RM         int64       `json:"rm"     gorm:"primaryKey;column:rm"`
	Nome       string      `json:"nome"   gorm:"not null;column:nome"          validate:"required,min=3,max=100"`
	Serie      string      `json:"serie"  gorm:"type:char(1);not null;column:serie" validate:"required,oneof=1 2 3"`
	CursoID    uint        `json:"curso_id" gorm:"not null;column:curso_id"`
	Curso      Curso       `json:"curso" gorm:"foreignKey:CursoID"`
	Saldo      float64     `json:"saldo"  gorm:"type:numeric(10,2);default:0"   validate:"min=0"`
	Senha      string      `json:"-"      gorm:"not null;column:senha"`
	Transacoes []Transacao `json:"transacoes,omitempty" gorm:"foreignKey:AlunoRM;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
	CreatedAt  time.Time   `json:"created_at"`
	UpdatedAt  time.Time   `json:"updated_at"`
}

func (Aluno) TableName() string {
	return "aluno"
}

type AlunoCreate struct {
	RM      int64   `json:"rm" validate:"required"`
	Nome    string  `json:"nome" validate:"required,min=3,max=100"`
	Serie   string  `json:"serie" validate:"required,oneof=1 2 3"`
	CursoID uint    `json:"curso_id" validate:"required"`
	Senha   string  `json:"senha" validate:"required,min=6"`
	Saldo   float64 `json:"saldo" validate:"min=0"`
}

type AlunoResponse struct {
	RM        int64     `json:"rm"`
	Nome      string    `json:"nome"`
	Serie     string    `json:"serie"`
	Curso     Curso     `json:"curso"`
	Saldo     float64   `json:"saldo"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type AlunoLogin struct {
	RM    int64  `json:"rm" validate:"required"`
	Senha string `json:"senha" validate:"required"`
}

func (a *Aluno) ToResponse() AlunoResponse {
	return AlunoResponse{
		RM:        a.RM,
		Nome:      a.Nome,
		Serie:     a.Serie,
		Curso:     a.Curso,
		Saldo:     a.Saldo,
		CreatedAt: a.CreatedAt,
		UpdatedAt: a.UpdatedAt,
	}
}
