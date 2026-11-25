package main

import (
	"log"
	"net/http"
	"net/url"
	"strings"

	"github.com/RuanBrunhera/Etecash/internal/config"
	"github.com/RuanBrunhera/Etecash/internal/routes"
	"github.com/RuanBrunhera/Etecash/internal/security"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Inicializar banco de dados
	config.Conn()

	// Carregar configurações do servidor
	cfg := config.LoadConfig()
	security.Init(cfg.JWT.SecretKey)

	// Criar roteador
	r := gin.Default()

	// CORS
	r.Use(cors.New(cors.Config{
		AllowOriginFunc: func(origin string) bool {
			if origin == "" {
				return false
			}

			parsed, err := url.Parse(origin)
			if err != nil || parsed.Scheme == "" || parsed.Host == "" {
				return false
			}

			host := strings.ToLower(parsed.Hostname())
			return parsed.Scheme == "http" && host == "localhost" ||
				parsed.Scheme == "https" && strings.HasSuffix(host, ".app.github.dev")
		},
		AllowMethods: []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Authorization", "Content-Type", "Accept", "Origin"},
		ExposeHeaders: []string{"Content-Length"},
		AllowCredentials: true,
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
