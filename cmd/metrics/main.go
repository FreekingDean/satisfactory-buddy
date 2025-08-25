package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/FreekingDean/satisfactory-buddy/internal/metrics"
	"github.com/FreekingDean/satisfactory-buddy/internal/parser"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

func main() {
	log.Println("Starting Satisfactory Metrics Server...")

	dirPath := os.Getenv("SAVES_DIR")
	jsonPath := os.Getenv("JSON_DIR")

	loadAndServeMetrics(dirPath, jsonPath)

	// Set up periodic updates (every 30 seconds)
	// In a real scenario, you'd reload the save file periodically
	go func() {
		ticker := time.NewTicker(30 * time.Second)
		defer ticker.Stop()

		for range ticker.C {
			loadAndServeMetrics(dirPath, jsonPath)
		}
	}()

	// Set up HTTP server for Prometheus metrics
	http.Handle("/metrics", promhttp.Handler())

	// Add a health check endpoint
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, "Satisfactory Metrics Server is healthy\n")
	})

	// Add a basic info endpoint
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html")
		fmt.Fprintf(w, `
		<h1>Satisfactory Metrics Server</h1>
		<hr>
		<p><a href="/metrics">Prometheus Metrics</a></p>
		<p><a href="/health">Health Check</a></p>
		`,
		)
	})

	port := ":8081"
	log.Printf("🚀 Starting HTTP server on %s", port)
	log.Printf("📊 Prometheus metrics available at http://localhost%s/metrics", port)
	log.Printf("💚 Health check available at http://localhost%s/health", port)

	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func loadAndServeMetrics(dirPath, jsonPath string) {
	log.Printf("Loading save file from directory: %s", dirPath)
	entries, err := os.ReadDir(dirPath)
	if err != nil {
		log.Fatalf("Error reading directory: %v", err)
	}

	// Find the most recently modified save file
	var latestFile os.DirEntry
	var latestModTime time.Time
	for _, entry := range entries {
		log.Printf("Found file: %s", entry.Name())
		if entry.Type().IsRegular() {
			info, err := entry.Info()
			if err != nil {
				log.Printf("Error getting file info: %v", err)
				continue
			}
			if info.ModTime().After(latestModTime) {
				latestModTime = info.ModTime()
				latestFile = entry
			}
		}
	}
	if latestFile == nil {
		log.Println("No save files found")
		return
	}

	saveFilePath := dirPath + "/" + latestFile.Name()
	saveFile, err := parser.Parse(saveFilePath, jsonPath)
	log.Printf("✅ Successfully loaded save file: %s", saveFile.Header.SaveName)
	log.Printf("📊 Save contains %d levels with buildings", len(saveFile.Levels))

	// Load save file
	if err != nil {
		log.Fatalf("Failed to decode save file: %v", err)
	}

	// Create metrics collector
	collector := metrics.NewMetricsCollector(&saveFile)

	// Initial metrics update
	collector.UpdateMetrics()
	// In a real implementation, you might reload the save file here
	// For now, we'll just refresh the metrics from the same data
	collector.UpdateMetrics()
}
