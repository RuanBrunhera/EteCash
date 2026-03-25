package model

type Produto struct {
	ID        uint    `json:"id"       gorm:"primaryKey"`
	Nome      string  `json:"nome"     gorm:"not null;column:nome"           validate:"required,min=3,max=100"`
	Descricao *string `json:"descricao" gorm:"column:descricao"             validate:"omitempty,max=255"`
	Preco     float64 `json:"preco"    gorm:"type:numeric(10,2);not null"    validate:"required,gt=0"`
	Estoque   int     `json:"estoque"  gorm:"not null;check:estoque >= 0"    validate:"min=0"`
	Ativo     bool    `json:"ativo"    gorm:"default:true"`
}
