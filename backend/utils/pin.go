package utils

import (
	"fmt"
	"math/rand"
)

// Gera um PIN aleatório temporário de 4 digitos
func GerarPin() string {
	numero := rand.Intn(10000)
	return fmt.Sprintf("%04d", numero)
}
