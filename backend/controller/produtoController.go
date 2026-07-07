package controller

import (
	"net/http"
	"strconv"

	"github.com/RuanBrunhera/Etecash/config"
	"github.com/RuanBrunhera/Etecash/model"
	"github.com/gin-gonic/gin"
)

// Criar um novo produto
func CriarProduto(c *gin.Context) {
	var create model.ProdutoCreate
	if err := c.ShouldBindJSON(&create); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos", "details": err.Error()})
		return
	}

	produto := model.Produto{
		Nome:      create.Nome,
		Descricao: create.Descricao,
		Preco:     create.Preco,
		Estoque:   create.Estoque,
	}

	if err := config.DB.Create(&produto).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao criar produto"})
		return
	}

	resp := model.ProdutoResponse{
		ID:        produto.ID,
		Nome:      produto.Nome,
		Descricao: produto.Descricao,
		Preco:     produto.Preco,
		Estoque:   produto.Estoque,
		Ativo:     produto.Ativo,
		CreatedAt: produto.CreatedAt,
		UpdatedAt: produto.UpdatedAt,
	}

	c.JSON(http.StatusCreated, gin.H{"produto": resp})

}

// Listar todos os produtos
func ListarProdutos(c *gin.Context) {
	var produtos []model.Produto
	if err := config.DB.Find(&produtos).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar produtos"})
		return
	}

	resp := make([]model.ProdutoResponse, 0, len(produtos))
	for _, p := range produtos {
		resp = append(resp, model.ProdutoResponse{
			ID:        p.ID,
			Nome:      p.Nome,
			Descricao: p.Descricao,
			Preco:     p.Preco,
			Estoque:   p.Estoque,
			Ativo:     p.Ativo,
			CreatedAt: p.CreatedAt,
			UpdatedAt: p.UpdatedAt,
		})
	}

	c.JSON(http.StatusOK, gin.H{"produtos": resp})

}

// Atualizar um produto existente
func AtualizarProduto(c *gin.Context) {
	//Pegar o ID da URL
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	//Buscar o produto no banco
	var produto model.Produto
	if err := config.DB.First(&produto, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Produto não encontrado"})
		return
	}

	//Atualizar campos com os dados recebidos
	var update model.ProdutoUpdate
	if err := c.ShouldBindJSON(&update); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos", "details": err.Error()})
		return
	}

	if update.Nome != "" {
		produto.Nome = update.Nome
	}

	if update.Descricao != nil {
		produto.Descricao = update.Descricao
	}

	if update.Preco != 0 {
		produto.Preco = update.Preco
	}

	//OBSERVAÇÃO: o estoque realmente pode estar zerado, ai aplica quando tiver um valor diferente do atual
	if update.Estoque != 0 {
		produto.Estoque = update.Estoque
	}

	if update.Ativo != nil {
		produto.Ativo = *update.Ativo
	}

	if err := config.DB.Save(&produto).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar produto"})
		return
	}

	resp := model.ProdutoResponse{
		ID:        produto.ID,
		Nome:      produto.Nome,
		Descricao: produto.Descricao,
		Preco:     produto.Preco,
		Estoque:   produto.Estoque,
		Ativo:     produto.Ativo,
		CreatedAt: produto.CreatedAt,
		UpdatedAt: produto.UpdatedAt,
	}

	//Retornar o produto atualizado
	c.JSON(http.StatusOK, gin.H{"produto": resp})

}
