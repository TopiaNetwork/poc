package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
)

func main() {
	http.HandleFunc("/soljson.js", func(w http.ResponseWriter, r *http.Request) {
		// 获取要返回的文件路径
		filePath := "soljson.js"

		// 打开文件
		file, err := os.Open(filePath)
		if err != nil {
			http.Error(w, fmt.Sprintf("failed to open file: %s", err), http.StatusInternalServerError)
			return
		}
		defer file.Close()

		// 设置响应头
		w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", filepath.Base(filePath)))
		w.Header().Set("Content-Type", "application/octet-stream")

		// 将文件写入 HTTP 响应
		_, err = io.Copy(w, file)
		if err != nil {
			http.Error(w, fmt.Sprintf("failed to write file to response: %s", err), http.StatusInternalServerError)
			return
		}
	})

	// 启动 HTTP 服务
	if err := http.ListenAndServe(":50000", nil); err != nil {
		panic(fmt.Sprintf("failed to start HTTP server: %s", err))
	}
}
