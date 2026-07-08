package main

import (
	"log"
	"net/http"

	"github.com/RuanBrunhera/Etecash/config"
	"github.com/RuanBrunhera/Etecash/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Inicializar banco de dados
	config.Conn()

	// Carregar configurações do servidor
	cfg := config.LoadConfig()

	// Criar roteador
	r := gin.Default()

	// CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Type", "Authorization"},
	}))

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "online",
		})
	})

	// Setup de todas as rotas
	routes.SetupRoutes(r)

	// Iniciar Servidor
	log.Printf("Iniciando servidor na porta %s...\n", cfg.Server.Port)
	if err := r.Run(":" + cfg.Server.Port); err != nil {
		log.Fatalf("Falha ao iniciar servidor: %v", err)
	}
}
