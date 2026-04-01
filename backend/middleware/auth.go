package middleware

import (
	"net/http"
	"strings"

	"github.com/RuanBrunhera/Etecash/utils"
	"github.com/gin-gonic/gin"
)

func AuthMiddleware(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"erro": "Token não fornecido ou inválido"})
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
		claims, err := utils.ValidateToken(tokenStr)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"erro": "Token inválido/expirado"})
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
				c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"erro": "Acesso negado."})
				return
			}
		}

		c.Set("userID", claims.ID)
		c.Set("userRole", claims.Role)
		c.Next()
	}
}
