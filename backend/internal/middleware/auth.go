package middleware

import (
	"errors"
	"net/http"
	"strings"

	"github.com/RuanBrunhera/Etecash/internal/config"
	"github.com/RuanBrunhera/Etecash/internal/model"
	"github.com/RuanBrunhera/Etecash/internal/security"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

var errRoleDesconhecida = errors.New("role desconhecida")

func AuthMiddleware(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token não fornecido ou inválido"})
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
		claims, err := security.ValidateToken(tokenStr)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token inválido/expirado"})
			return
		}

		// Valida as permissões do cargo, caso exigido
		if len(roles) > 0 {
			hasRole := false
			for _, role := range roles {
				if claims.Role == role {
					hasRole = true
					break
				}
			}
			if !hasRole {
				c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Acesso negado."})
				return
			}
		}

		// Confere no banco se a conta continua ativa
		var conta struct {
			Ativo bool `gorm:"column:ativo"`
		}
		query, err := queryContaAtiva(config.DB, claims.Role, claims.ID)
		if err == nil {
			err = query.First(&conta).Error
		}

		switch {
		case errors.Is(err, errRoleDesconhecida):
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Acesso negado."})
			return
		case errors.Is(err, gorm.ErrRecordNotFound):
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Conta não encontrada. Faça login novamente."})
			return
		case err != nil:
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Erro ao verificar a conta."})
			return
		case !conta.Ativo:
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Conta desativada. Faça login novamente."})
			return
		}

		c.Set("userID", claims.ID)
		c.Set("userRole", claims.Role)
		c.Next()
	}
}

func queryContaAtiva(db *gorm.DB, role string, id uint64) (*gorm.DB, error) {
	switch role {
	case "aluno":
		return db.Model(&model.Aluno{}).Select("ativo").Where("rm = ?", id), nil
	case "funcionario", "admin":
		return db.Model(&model.Funcionario{}).Select("ativo").Where("id = ?", id), nil
	default:
		return nil, errRoleDesconhecida
	}
}
