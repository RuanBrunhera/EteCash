package routes

import (
	"github.com/RuanBrunhera/Etecash/controller"
	"github.com/RuanBrunhera/Etecash/middleware"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")

	// Rotas sem autenticação
	api.POST("/login/aluno", controller.LoginAluno)
	api.POST("/login/funcionario", controller.LoginFuncionario)
	api.POST("/aluno/cadastrar", controller.CadastrarAluno)
	api.GET("/cursos", controller.ListarCursos)

	// Rotas exclusivas de Funcionários
	authFunc := api.Group("/func")
	authFunc.Use(middleware.AuthMiddleware("funcionario"))
	{
		authFunc.GET("/perfil", controller.GetPerfilFuncionario)
		authFunc.POST("/produto", controller.CriarProduto)
		authFunc.GET("/produtos", controller.ListarProdutos)
		authFunc.PUT("/produto/:id", controller.AtualizarProduto)
		authFunc.POST("/transacao", controller.EfetuarTransacao)
		authFunc.GET("/resumo-dia", controller.GetResumoDia)
	}

	// Rotas exclusivas de Alunos
	authAluno := api.Group("/aluno")
	authAluno.Use(middleware.AuthMiddleware("aluno"))
	{
		authAluno.GET("/perfil", controller.GetPerfilAluno)
		authAluno.GET("/historico", controller.GetHistoricoAluno)
		authAluno.POST("/saldo", controller.AdicionarSaldo)
	}
}
