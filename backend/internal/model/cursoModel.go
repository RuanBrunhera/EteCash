package model

type Curso struct {
	ID      uint   `json:"id" gorm:"primaryKey"`
	Nome    string `json:"nome" gorm:"not null"`
	Periodo string `json:"periodo" gorm:"not null" validate:"required,oneof=manha tarde noite"`
	Ativo   bool   `json:"ativo" gorm:"not null;default:true"`
}

func (Curso) TableName() string {
	return "curso"
}
