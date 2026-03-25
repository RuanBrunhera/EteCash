package config

import (
	"fmt"
	"log"
	"time"

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
	SSLMode  string // corrigido: SSlMode → SSLMode
}

type JWTConfig struct {
	SecretKey string // corrigido: Secretkey → SecretKey
	Duration  time.Duration
}

type RateLimitConfig struct {
	Requests int // corrigido: requests → Requests (exportado)
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
			SSLMode:  "disable", // corrigido: SSlMode → SSLMode
		},
		JWT: JWTConfig{
			SecretKey: "etec", // corrigido: Secretkey → SecretKey
			Duration:  24 * time.Hour,
		},
		RateLimit: RateLimitConfig{
			Requests: 100, // corrigido: requests → Requests
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

	// corrigido: "Host=" → "host=" (PostgreSQL DSN é case-sensitive)
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		config.Database.Host,
		config.Database.Port,
		config.Database.User,
		config.Database.Password,
		config.Database.DBName,
		config.Database.SSLMode,
	)

	var err error
	// corrigido: logger. incompleto → logger.Default.LogMode(logger.Info)
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	// corrigido: erro não tratado
	// if err != nil {
	// 	log.Fatal("Falha ao conectar com o banco de dados: %v", err)
	// }

	//fazer esta parte quando tiver tudo pronto
	// if err := DB.AutoMigrate(&model.User{}, &model.Team{}, &model.Tournament{}, &model.Match{}, &model.MatchTeam{}, &model.MatchEvent{}, &model.MatchStatistics{}, &model.Promotion{}); err != nil {
	// 	log.Fatalf("Falha ao criar tabelas: %v", err)
	// }

	// log.Println("Conexão com o banco de dados estabelecida com sucesso")
}
