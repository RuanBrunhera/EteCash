package security

import (
	"math/rand"
)

func GerarSenhaTemporaria() string {
	// Versão alfanumérica
	const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
	senha := make([]byte, 8)
	for i := range senha {
		senha[i] = caracteres[rand.Intn(len(caracteres))]
	}
	return string(senha)
}
