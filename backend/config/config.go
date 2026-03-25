package config

import (
	"fmt"
	"log"
	"time"

	"github.com/RuanBrunhera/Etecash/model"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

type Config struct {
	Server    ServerConfig
	Database  DatabaseConfig
	JWT       JWTConfig
	RateLimit RateLimitConfig
}

type ServerConfig struct {
	Port         string
	ReadTimeOut  time.Duration
	WriteTimeOut time.Duration
}

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
	SSLMode  string
}

type JWTConfig struct {
	SecretKey string
	Duration  time.Duration
}

type RateLimitConfig struct {
	Requests int
	Window   time.Duration
}

func LoadConfig() *Config {
	config := &Config{
		Server: ServerConfig{
			Port:         "9000",
			ReadTimeOut:  15 * time.Second,
			WriteTimeOut: 15 * time.Second,
		},
		Database: DatabaseConfig{
			Host:     "localhost",
			Port:     "5432",
			User:     "api_etecash",
			Password: "123456",
			DBName:   "DB_etecash",
			SSLMode:  "disable",
		},
		JWT: JWTConfig{
			SecretKey: "etec",
			Duration:  24 * time.Hour,
		},
		RateLimit: RateLimitConfig{
			Requests: 100,
			Window:   time.Minute,
		},
	}

	if config.JWT.SecretKey == "etec" {
		log.Println("AVISO: JWT_SECRET_KEY não está configurado, usando valor padrão inseguro")
	}

	if config.Database.Password == "123456" {
		log.Println("AVISO: DB_PASSWORD está usando o valor padrão, considere alterá-lo em produção")
	}

	return config
}

func Conn() {
	config := LoadConfig()

	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		config.Database.Host,
		config.Database.Port,
		config.Database.User,
		config.Database.Password,
		config.Database.DBName,
		config.Database.SSLMode,
	)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatalf("Falha ao conectar com o banco de dados: %v", err)
	}

	if err := DB.AutoMigrate(&model.Aluno{}, &model.Funcionario{}, &model.Produto{}, &model.Transacao{}, &model.ItemTransacao{}); err != nil {
		log.Fatalf("Falha ao criar tabelas: %v", err)
	}

	log.Println("Conexão com o banco de dados estabelecida com sucesso")
}
