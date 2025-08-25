package metrics

import (
	"log"

	"github.com/FreekingDean/satisfactory-buddy/internal/savefile"
)

var (
// TODO(DG): Inventory metrics
// inventoryLevels = promauto.NewGaugeVec(
//
//	prometheus.GaugeOpts{
//		Name: "inventory_levels",
//		Help: "Current inventory levels of items",
//	},
//	[]string{"id", "type", "subtype", "item_name"},
//
// )
)

// MetricsCollector handles collecting and updating Prometheus metrics from save file data
type MetricsCollector struct {
	saveFile *savefile.SaveFile
}

// NewMetricsCollector creates a new metrics collector
func NewMetricsCollector(saveFile *savefile.SaveFile) *MetricsCollector {
	return &MetricsCollector{
		saveFile: saveFile,
	}
}

// UpdateMetrics updates all Prometheus metrics with current save file data
func (mc *MetricsCollector) UpdateMetrics() {
	log.Println("Updating Prometheus metrics from save file...")

	// Clear existing metrics
	powerGeneration.Reset()
	powerConsumption.Reset()

	mc.updatePowerMetrics()
}
