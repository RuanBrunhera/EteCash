package router

import "github.com/gin-gonic/gin"

func Init() {
	r := gin.Default()

	r.Run(":8080")
}
