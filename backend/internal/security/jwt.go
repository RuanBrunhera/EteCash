package security

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var secretKey []byte

func Init(secret string) {
	secretKey = []byte(secret)
}

type Claims struct {
	ID   uint64 `json:"id"`
	Role string `json:"role"` // "aluno", "funcionario" ou "admin"
	jwt.RegisteredClaims
}

// GenerateToken cria um token JWT válido para um usuário.
func GenerateToken(id uint64, role string, duration time.Duration) (string, error) {
	if len(secretKey) == 0 {
		return "", errors.New("chave secreta JWT não inicializada")
	}

	claims := Claims{
		ID:   id,
		Role: role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(duration)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(secretKey)
}

// ValidateToken faz a leitura e validação da string JWT.
func ValidateToken(tokenStr string) (*Claims, error) {
	if len(secretKey) == 0 {
		return nil, errors.New("chave secreta JWT não inicializada")
	}

	token, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return secretKey, nil
	}, jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}))

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return nil, errors.New("token inválido")
	}

	return claims, nil
}
