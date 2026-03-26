package model

type Aluno struct {
	RM    int     `json:"rm"     gorm:"primaryKey;column:rm"`
	Nome  string  `json:"nome"   gorm:"not null;column:nome"          validate:"required,min=3,max=100"`
	Serie string  `json:"serie"  gorm:"type:char(1);not null;column:serie" validate:"required,oneof=1 2 3"`
	Saldo float64 `json:"saldo"  gorm:"type:numeric(10,2);default:0"   validate:"min=0"`
	Senha string  `json:"-"      gorm:"not null;column:senha"`
}
