package model

import "time"

type Transacao struct {
	ID            uint      `json:"id"             gorm:"primaryKey"`
	AlunoRM       int       `json:"aluno_rm"       gorm:"not null;column:aluno_rm"       validate:"required"`
	FuncionarioID uint      `json:"funcionario_id" gorm:"not null;column:funcionario_id"  validate:"required"`
	ValorTotal    float64   `json:"valor_total"    gorm:"type:numeric(10,2);not null"     validate:"required,gt=0"`
	DataHora      time.Time `json:"data_hora"      gorm:"column:data_hora;default:CURRENT_TIMESTAMP"`

	// Relacionamentos
	Aluno       Aluno           `json:"aluno"          gorm:"foreignKey:AlunoRM;references:RM"`
	Funcionario Funcionario     `json:"funcionario"    gorm:"foreignKey:FuncionarioID"`
	Itens       []ItemTransacao `json:"itens"          gorm:"foreignKey:TransacaoID"`
}

type ItemTransacao struct {
	ID            uint    `json:"id"             gorm:"primaryKey"`
	TransacaoID   uint    `json:"transacao_id"   gorm:"not null;column:transacao_id"  validate:"required"`
	ProdutoID     uint    `json:"produto_id"     gorm:"not null;column:produto_id"    validate:"required"`
	Quantidade    int     `json:"quantidade"     gorm:"not null;check:quantidade > 0" validate:"required,min=1"`
	PrecoUnitario float64 `json:"preco_unitario" gorm:"type:numeric(10,2);not null"   validate:"required,gt=0"`

	// Relacionamento
	Produto Produto `json:"produto"        gorm:"foreignKey:ProdutoID"`
}

func (ItemTransacao) TableName() string {
	return "item_transacao"
}
