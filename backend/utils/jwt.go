package utils

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var SecretKey = []byte("etec") // Em produção deve vir do env / config

type Claims struct {
	ID   uint   `json:"id"`
	Role string `json:"role"` // "aluno" ou "funcionario"
	jwt.RegisteredClaims
}

// GenerateToken cria um token JWT válido para um usuário.
func GenerateToken(id uint, role string, duration time.Duration) (string, error) {
	claims := Claims{
		ID:   id,
		Role: role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(duration)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(SecretKey)
}

// ValidateToken faz a leitura e validação da string JWT.
func ValidateToken(tokenStr string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return SecretKey, nil
	})

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return nil, errors.New("token inválido")
	}

	return claims, nil
}
