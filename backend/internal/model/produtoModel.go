package model

import "time"

type Produto struct {
	ID        uint      `json:"id"       gorm:"primaryKey"`
	Nome      string    `json:"nome"     gorm:"not null;column:nome"           binding:"required,min=3,max=100"`
	Descricao *string   `json:"descricao" gorm:"column:descricao"             binding:"omitempty,max=255"`
	Preco     float64   `json:"preco"    gorm:"type:numeric(10,2);not null"    binding:"required,gt=0"`
	Estoque   int       `json:"estoque"  gorm:"not null;check:estoque >= 0"    binding:"min=0"`
	Ativo     bool      `json:"ativo"    gorm:"default:true"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (Produto) TableName() string {
	return "produto"
}

type ProdutoCreate struct {
	Nome      string  `json:"nome"      binding:"required,min=3,max=100"`
	Descricao *string `json:"descricao" binding:"omitempty,max=255"`
	Preco     float64 `json:"preco"     binding:"required,gt=0"`
	Estoque   int     `json:"estoque"   binding:"min=0"`
}

type ProdutoUpdate struct {
	Nome      string  `json:"nome"      binding:"omitempty,min=3,max=100"`
	Descricao *string `json:"descricao" binding:"omitempty,max=255"`
	Preco     float64 `json:"preco"     binding:"omitempty,gt=0"`
	Estoque   *int    `json:"estoque"   binding:"omitempty,min=0"`
	Ativo     *bool   `json:"ativo"     binding:"omitempty"`
}

type ProdutoResponse struct {
	ID        uint      `json:"id"`
	Nome      string    `json:"nome"`
	Descricao *string   `json:"descricao"`
	Preco     float64   `json:"preco"`
	Estoque   int       `json:"estoque"`
	Ativo     bool      `json:"ativo"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
