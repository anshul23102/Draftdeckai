// Package main is the entry point for the DraftDeckAI Go backend server.
package main

import (
	"log"
	"log/slog"
	"net/http"
	"os"

	"github.com/Muneerali199/Draftdeckai/backend/go/middleware"
	"github.com/Muneerali199/Draftdeckai/backend/go/pkg/config"
)

func initLogger() {
	level := slog.LevelInfo

	switch os.Getenv("LOG_LEVEL") {
	case "DEBUG":
		level = slog.LevelDebug
	case "WARN":
		level = slog.LevelWarn
	case "ERROR":
		level = slog.LevelError
	}

	// JSON output by default — structured and parseable by Datadog/Grafana/CloudWatch
	handler := slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level: level,
	})
	slog.SetDefault(slog.New(handler))
}

func main() {
	// Init structured logger first so all startup logs are JSON
	initLogger()

	slog.Info("starting DraftDeckAI Go backend")

	// Validate all required environment variables before doing anything else.
	if err := config.ValidateEnv(); err != nil {
		log.Fatalf("FATAL: %v", err)
	}

	// Print startup summary with secrets masked
	config.PrintStartupSummary()

	port := os.Getenv("PORT")
if port == "" {
    port = "8080"
}

	mux := http.NewServeMux()

	// Health check endpoint
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		if _, err := w.Write([]byte(`{"status":"ok"}`)); err != nil {
			slog.Error("health write error", slog.Any("error", err))
		}
	})

	// Apply middleware: Recoverer → RequestLogger → mux
	RequestLogger(Recoverer(mux))
	handler := middleware.Recoverer(middleware.RequestLogger(mux))

	slog.Info("server listening", slog.String("port", port))

	if err := http.ListenAndServe(":"+port, handler); err != nil {
		log.Fatalf("FATAL: %v", err)
	}
}