package config

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/RuanBrunhera/Etecash/model"
	"github.com/joho/godotenv"
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
	godotenv.Load()

	config := &Config{
		Server: ServerConfig{
			Port:         getEnv("BACKEND_PORT", "2000"),
			ReadTimeOut:  15 * time.Second,
			WriteTimeOut: 15 * time.Second,
		},
		Database: DatabaseConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnv("DB_PORT", "5432"),
			User:     getEnv("DB_USER", "api_etecash"),
			Password: getEnv("DB_PASSWORD", "123456"),
			DBName:   getEnv("DB_NAME", "DB_etecash"),
			SSLMode:  getEnv("DB_SSLMODE", "disable"),
		},
		JWT: JWTConfig{
			SecretKey: getEnv("JWT_SECRET", "etec"),
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

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
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

	sqlDB, err := DB.DB()

	if err != nil {
		log.Fatalf("Falha ao conectar ao banco de dados: %v", err)
	}

	sqlDB.SetMaxOpenConns(25)
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetConnMaxLifetime(5 * time.Minute)

	if err := migrate(); err != nil {
		log.Fatalf("Falha ao executar os migrations: %v", err)
	}

	log.Printf("Conexão com o banco de dados estabelecida com sucesso")
}

func migrate() error {
	return DB.AutoMigrate(
		&model.Aluno{},
		&model.Funcionario{},
		&model.Produto{},
		&model.Transacao{},
		&model.ItemTransacao{},
		&model.Historico{},
	)
}
