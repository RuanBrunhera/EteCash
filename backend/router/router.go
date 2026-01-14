package router

import "github.com/gin-gonic/gin"

func Init() {
	r := gin.Default()
	r.GET("/ping", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{
			"message": "Pong",
		})
	})

	r.Run(":8080")
}
