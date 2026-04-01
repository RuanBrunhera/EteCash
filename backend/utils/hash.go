package utils

import (
	"crypto/sha256"
	"encoding/hex"
)

// HashSHA256 gera um hash SHA-256 para a senha recebida.
func HashSHA256(password string) string {
	hash := sha256.Sum256([]byte(password))
	return hex.EncodeToString(hash[:])
}

// CheckPasswordHash verifica se a senha crua bate com o hash.
func CheckPasswordHash(password, hash string) bool {
	return HashSHA256(password) == hash
}
