package routes

import (
	"github.com/RuanBrunhera/Etecash/controller"
	"github.com/RuanBrunhera/Etecash/middleware"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")

	// Rotas sem autenticação (Login/Cadastro de teste)
	api.POST("/login/aluno", controller.LoginAluno)
	api.POST("/login/funcionario", controller.LoginFuncionario)
	api.POST("/aluno/cadastrar", controller.CadastrarAluno)
	
	// Rotas autenticadas (Qualquer um, aluno ou func)
	authAny := api.Group("/")
	authAny.Use(middleware.AuthMiddleware())
	{
		// ... produtos leitura, info propria etc ...
	}

	// Rotas exclusivas de Funcionários
	authFunc := api.Group("/func")
	authFunc.Use(middleware.AuthMiddleware("funcionario"))
	{
		// CRUD Produtos
		authFunc.POST("/produto", controller.CriarProduto)
		authFunc.GET("/produtos", controller.ListarProdutos)
		authFunc.PUT("/produto/:id", controller.AtualizarProduto)

		// Transações
		authFunc.POST("/transacao", controller.EfetuarTransacao)
		
		authFunc.POST("/aluno/saldo", controller.AdicionarSaldo)
	}

	// Rotas exclusivas de Alunos
	authAluno := api.Group("/aluno")
	authAluno.Use(middleware.AuthMiddleware("aluno"))
	{
		authAluno.GET("/perfil", controller.GetPerfilAluno)
	}
}
