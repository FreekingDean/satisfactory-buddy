package metrics

import (
	"log"
	"strconv"
	"strings"

	"github.com/FreekingDean/satisfactory-buddy/internal/savefile"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var (
	// Power generation metrics
	powerGeneration = promauto.NewGaugeVec(
		prometheus.GaugeOpts{
			Name: "power_generation_mw",
			Help: "Current power generation in MW",
		},
		[]string{"circuit", "building_id", "building_type", "building_name", "potential"},
	)

	// Power consumption metrics
	powerConsumption = promauto.NewGaugeVec(
		prometheus.GaugeOpts{
			Name: "power_consumption_mw",
			Help: "Current power consumption in MW",
		},
		[]string{"circuit", "building_id", "building_type", "building_name", "potential"},
	)

	// Power capacity metrics
	powerMaxConsumption = promauto.NewGaugeVec(
		prometheus.GaugeOpts{
			Name: "power_max_consumption_mw",
			Help: "Maximum power consumption capacity in MW",
		},
		[]string{"circuit", "building_id", "building_type", "building_name", "potential"},
	)
)

// updatePowerMetrics collects power generation and consumption data
func (mc *MetricsCollector) updatePowerMetrics() {
	for _, obj := range mc.saveFile.AllGameObjects() {

		if strings.HasSuffix(obj.TypePath, "FGPowerInfoComponent") {
			mc.updatePowerMetric(obj)
		}
	}

	log.Printf("Updated power metrics for save file")
}

func (mc *MetricsCollector) updatePowerMetric(obj *savefile.GameObject) {
	parent := mc.saveFile.GetGameObject(obj.ParentEntityName)
	circuit := "-1"
	for _, compID := range parent.Components {
		component := mc.saveFile.GetGameObject(compID.PathName)
		if component.TypePath == "/Script/FactoryGame.FGPowerConnectionComponent" {
			circuit = strconv.Itoa(mc.saveFile.GetCircuit(component.InstanceName))
			if circuit != "-1" {
				break
			}
		}
	}
	buildingType := humanBuildingType(parent.SimpleType())
	buildingID := parent.Instance()
	potential := "hi"
	if buildingType == "Biomass Generator" || buildingType == "Fuel Generator" {
		amount := 0.0
		if val, ok := obj.Properties.FloatProperties["mDynamicProductionCapacity"]; ok {
			amount = val.Value
		}
		powerGeneration.WithLabelValues(circuit, buildingID, buildingType, buildingType, potential).Set(amount)
		return
	}

	if consumption, ok := obj.Properties.FloatProperties["mTargetConsumption"]; ok {
		powerConsumption.WithLabelValues(circuit, buildingID, buildingType, buildingType, potential).Set(consumption.Value)
	}
}

func humanBuildingType(t string) string {
	switch t {
	case "Build_GeneratorIntegratedBiomass_C":
		return "Biomass Generator"
	case "Build_GeneratorFuel_C":
		return "Fuel Generator"
	default:
		return t
	}
}
