package model

import "time"

type Transacao struct {
	ID            uint            `json:"id"             gorm:"primaryKey"`
	AlunoRM       int             `json:"aluno_rm"       gorm:"not null;column:aluno_rm"      validate:"required"`
	FuncionarioID uint            `json:"funcionario_id" gorm:"not null;column:funcionario_id" validate:"required"`
	ValorTotal    float64         `json:"valor_total"    gorm:"type:numeric(10,2);not null"    validate:"required,gt=0"`
	DataHora      time.Time       `json:"data_hora"      gorm:"column:data_hora;default:CURRENT_TIMESTAMP"`
	Aluno         Aluno           `json:"aluno,omitempty"       gorm:"foreignKey:AlunoRM;references:RM"`
	Funcionario   Funcionario     `json:"funcionario,omitempty" gorm:"foreignKey:FuncionarioID"`
	Itens         []ItemTransacao `json:"itens,omitempty"       gorm:"foreignKey:TransacaoID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
}

func (Transacao) TableName() string {
	return "transacao"
}

type ItemTransacao struct {
	ID            uint    `json:"id"             gorm:"primaryKey"`
	TransacaoID   uint    `json:"transacao_id"   gorm:"not null;column:transacao_id"  validate:"required"`
	ProdutoID     uint    `json:"produto_id"     gorm:"not null;column:produto_id"    validate:"required"`
	Quantidade    int     `json:"quantidade"     gorm:"not null;check:quantidade > 0" validate:"required,min=1"`
	PrecoUnitario float64 `json:"preco_unitario" gorm:"type:numeric(10,2);not null"   validate:"required,gt=0"`
	Produto       Produto `json:"produto,omitempty" gorm:"foreignKey:ProdutoID"`
}

func (ItemTransacao) TableName() string {
	return "item_transacao"
}

type TransacaoCreate struct {
	AlunoRM       int                   `json:"aluno_rm"       validate:"required"`
	FuncionarioID uint                  `json:"funcionario_id" validate:"required"`
	Itens         []ItemTransacaoCreate `json:"itens"          validate:"required,min=1,dive"`
}

type ItemTransacaoCreate struct {
	ProdutoID  uint `json:"produto_id"  validate:"required"`
	Quantidade int  `json:"quantidade"  validate:"required,min=1"`
}

type ItemTransacaoResponse struct {
	ID            uint    `json:"id"`
	ProdutoID     uint    `json:"produto_id"`
	Quantidade    int     `json:"quantidade"`
	PrecoUnitario float64 `json:"preco_unitario"`
}

type TransacaoResponse struct {
	ID            uint                    `json:"id"`
	AlunoRM       int                     `json:"aluno_rm"`
	FuncionarioID uint                    `json:"funcionario_id"`
	ValorTotal    float64                 `json:"valor_total"`
	DataHora      time.Time               `json:"data_hora"`
	Itens         []ItemTransacaoResponse `json:"itens"`
}
