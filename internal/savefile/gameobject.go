package savefile

import (
	"strings"
)

// GameObject represents a game object/building in the world
type GameObject struct {
	TypePath                            string            `json:"typePath"`
	RootObject                          string            `json:"rootObject"`
	InstanceName                        string            `json:"instanceName"`
	Flags                               int               `json:"flags"`
	Properties                          PropertyContainer `json:"properties"`
	SpecialProperties                   interface{}       `json:"specialProperties"`
	TrailingData                        []interface{}     `json:"trailingData"`
	SaveCustomVersion                   int               `json:"saveCustomVersion"`
	ShouldMigrateObjectRefsToPersistent bool              `json:"shouldMigrateObjectRefsToPersistent"`
	ParentEntityName                    string            `json:"parentEntityName"`
	Type                                string            `json:"type"`
	NeedTransform                       bool              `json:"needTransform"`
	WasPlacedInLevel                    bool              `json:"wasPlacedInLevel"`
	ParentObject                        ObjectReference   `json:"parentObject"`
	Transform                           Transform         `json:"transform"`
	Components                          []Component       `json:"components"`

	instance   string
	simpleType string
}

func (g *GameObject) cacheData() {
	parts := strings.Split(g.InstanceName, ".")
	if len(parts) >= 1 {
		g.instance = parts[len(parts)-1]
	}

	parts = strings.Split(g.TypePath, ".")
	if len(parts) >= 1 {
		g.simpleType = parts[len(parts)-1]
	}
}

func (g *GameObject) Instance() string {
	if g.instance == "" {
		g.cacheData()
	}
	return g.instance
}

func (g *GameObject) SimpleType() string {
	if g.simpleType == "" {
		g.cacheData()
	}
	return g.simpleType
}
