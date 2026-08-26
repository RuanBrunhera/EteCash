package controller

import (
	"net/http"
	"time"

	"github.com/RuanBrunhera/Etecash/config"
	"github.com/RuanBrunhera/Etecash/model"
	"github.com/RuanBrunhera/Etecash/utils"
	"github.com/gin-gonic/gin"
)

func GetPerfilFuncionario(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		return
	}

	id := userID.(uint64)

	var funcionario model.Funcionario
	if err := config.DB.Where("id = ?", id).First(&funcionario).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Funcionário não encontrado"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"funcionario": funcionario.ToResponse()})
}

func LoginFuncionario(c *gin.Context) {
	var login model.FuncionarioLogin
	if err := c.ShouldBindJSON(&login); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Dados inválidos",
			"details": err.Error(),
		})
		return
	}

	//Busca o funcionário pelo telefone
	var funcionario model.Funcionario
	if err := config.DB.Where("cpf = ?", login.CPF).First(&funcionario).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "CPF inválido",
		})
		return
	}

	//Verifica a senha
	if !utils.CheckPasswordHash(login.Senha, funcionario.Senha) {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Senha inválida",
		})
		return
	}

	// Decide a role com base em funcionario.IsAdmin
	role := "funcionario"
	if funcionario.IsAdmin {
		role = "admin"
	}

	//Gera o token JWT
	token, err := utils.GenerateToken(uint64(funcionario.ID), role, 24*time.Hour)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Erro ao gerar token JWT",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token":       token,
		"funcionario": funcionario.ToResponse(),
	})
}

func AtualizarPerfilFuncionario(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		return
	}

	id := userID.(uint64)

	var update model.FuncionarioUpdate
	if err := c.ShouldBindJSON(&update); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Dados inválidos",
			"details": err.Error(),
		})
		return
	}

	var funcionario model.Funcionario
	if err := config.DB.Where("id = ?", id).First(&funcionario).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Funcionário não encontrado"})
		return
	}

	if update.Nome != nil {
		funcionario.Nome = *update.Nome
	}

	if update.Email != nil {
		funcionario.Email = update.Email
	}

	if update.DataNasc != nil {
		funcionario.DataNasc = update.DataNasc
	}

	if update.Telefone != nil {
		funcionario.Telefone = update.Telefone
	}

	if err := config.DB.Save(&funcionario).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar perfil do funcionário"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"funcionario": funcionario.ToResponse()})
}

func AtualizarSenhaFuncionario(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		return
	}

	id := userID.(uint64)

	var update model.FuncionarioAtualizarSenha
	if err := c.ShouldBindJSON(&update); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos", "details": err.Error()})
		return
	}

	if update.NovaSenha != update.ConfirmarSenhaNova {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "As senhas não conferem"})
		return
	}

	var funcionario model.Funcionario
	if err := config.DB.Where("id = ?", id).First(&funcionario).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuário não encontrado"})
		return
	}

	if !utils.CheckPasswordHash(update.SenhaAtual, funcionario.Senha) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Senha atual incorreta"})
		return
	}

	if update.SenhaAtual == update.NovaSenha {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "Senha nova é igual à senha atual"})
		return
	}

	funcionario.Senha = utils.HashSHA256(update.NovaSenha)
	if err := config.DB.Save(&funcionario).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar senha"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Senha atualizada com sucesso"})

}

func CadastrarFuncionario(c *gin.Context) {
	// TODO 1: bind do JSON pro model.FuncionarioCreate, 400 com return se erro
	//         (igual CadastrarAluno faz com AlunoCreate)

	var create model.FuncionarioCreate
	if err := c.ShouldBindJSON(&create); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos", "details": err.Error()})
		return
	}

	// TODO 2: verificar se o CPF já existe
	//         (mesmo padrão de CadastrarAluno pro RM: Count() e 409 Conflict se count > 0)

	var count int64
	if err := config.DB.Model(&model.Funcionario{}).Where("cpf = ?", create.CPF).Count(&count).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao verificar CPF"})
		return
	}
	if count > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "CPF já cadastrado"})
		return
	}

	// TODO 3: gerar a senha temporária com utils.GerarSenhaTemporaria()
	//         e o hash dela com utils.HashSHA256()
	//         (equivalente ao bloco de GerarPin()/HashSHA256() do CadastrarAluno,
	//         mas aqui não tem PIN nem Senha vindo do FuncionarioCreate pro admin
	//         digitar — pensa: o FuncionarioCreate ainda tem campo Senha? Se tiver,
	//         faz sentido continuar aceitando isso, já que decidimos gerar
	//         senha temporária em vez do admin digitar?)

	senhaTemporaria := utils.GerarSenhaTemporaria()
	funcionario := model.Funcionario{
		Nome:     create.Nome,
		CPF:      create.CPF,
		Email:    create.Email,
		DataNasc: create.DataNasc,
		Telefone: create.Telefone,
		Senha:    utils.HashSHA256(senhaTemporaria),
	}

	// TODO 4: montar o model.Funcionario com os dados do create + hash da senha gerada
	//         (repara: Nome, CPF, Email, DataNasc, Telefone vêm do `create`;
	//         Senha vem do hash gerado no TODO 3; IsAdmin não é setado aqui —
	//         pensa por quê: um admin cadastrando outro funcionário pelo sistema
	//         deveria conseguir promover esse novo funcionário a admin direto
	//         no cadastro, ou isso deveria ser uma ação separada, futura, tipo
	//         "promover a admin"? não precisa resolver agora, só ter em mente)

	// TODO 5: salvar com config.DB.Create(), 500 com return se erro

	if err := config.DB.Create(&funcionario).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao criar funcionário"})
		return
	}

	// TODO 6: retornar a senha temporária em texto puro na resposta,
	//         UMA ÚNICA VEZ (igual AlunoCadastroResponse faz com o PIN) —
	//         monte um FuncionarioCadastroResponse (ainda não existe, você
	//         vai precisar criar no model) com os dados do funcionário +
	//         a senha temporária em texto puro

	resposta := model.FuncionarioCadastroResponse{
		ID:        funcionario.ID,
		Nome:      funcionario.Nome,
		CPF:       funcionario.CPF,
		Email:     funcionario.Email,
		Telefone:  funcionario.Telefone,
		DataNasc:  funcionario.DataNasc,
		SenhaTemp: senhaTemporaria,
	}

	c.JSON(http.StatusCreated, gin.H{"funcionario": resposta})

}
