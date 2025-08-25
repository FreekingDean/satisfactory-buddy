package savefile

import (
	"encoding/json"
	"fmt"
	"strconv"
	"time"
)

// SaveFile represents the complete structure of a Satisfactory save file
type SaveFile struct {
	GridHash                GridHash                  `json:"gridHash"`
	Grids                   Grids                     `json:"grids"`
	Header                  Header                    `json:"header"`
	Levels                  map[string]Level          `json:"levels"`
	Name                    string                    `json:"name"`
	CompressionInfo         CompressionInfo           `json:"compressionInfo"`
	UnresolvedWorldSaveData []UnresolvedWorldSaveData `json:"unresolvedWorldSaveData"`

	cachedObjects map[string]*GameObject
	circuitCache  map[string]*GameObject
}

func (sf SaveFile) GetGameObject(key string) *GameObject {
	return sf.cachedObjects[key]
}

func (sf SaveFile) GetCircuit(key string) int {
	if circuit, ok := sf.circuitCache[key]; ok {
		if circuitID, ok := circuit.Properties.Int32Properties["mCircuitID"]; ok {
			return int(circuitID.Value)
		}
	}

	return -1
}

func (sf SaveFile) AllGameObjects() map[string]*GameObject {
	return sf.cachedObjects
}

// GridHash represents the grid hash information
type GridHash struct {
	Version int   `json:"version"`
	Hash1   []int `json:"hash1"`
	Hash2   []int `json:"hash2"`
}

// Grids contains all the different grid types found in Satisfactory saves
type Grids struct {
	MainGrid         MainGrid        `json:"MainGrid"`
	LandscapeGrid    LandscapeGrid   `json:"LandscapeGrid"`
	FoliageGrid      FoliageGrid     `json:"FoliageGrid"`
	ExplorationGrid  ExplorationGrid `json:"ExplorationGrid"`
	HLOD0_256m_1023m HLOD0Grid       `json:"HLOD0_256m_1023m"`
}

// MainGrid represents the main game grid containing most game objects
type MainGrid struct {
	Children map[string]int64 `json:"children"`
}

// LandscapeGrid represents the landscape/terrain grid
type LandscapeGrid struct {
	CellSize int              `json:"cellSize"`
	Children map[string]int64 `json:"children"`
}

// FoliageGrid represents vegetation and foliage data
type FoliageGrid struct {
	CellSize int              `json:"cellSize"`
	Children map[string]int64 `json:"children"`
}

// ExplorationGrid represents explored areas of the map
type ExplorationGrid struct {
	CellSize int              `json:"cellSize"`
	Children map[string]int64 `json:"children"`
}

// HLOD0Grid represents hierarchical level of detail grid
type HLOD0Grid struct {
	CellSize int              `json:"cellSize"`
	Children map[string]int64 `json:"children"`
}

// ConsistencyHash represents the consistency hash structure
type ConsistencyHash struct {
	IsValid bool  `json:"isValid"`
	Hash    []int `json:"hash"`
}

// Header contains all save file header information
type Header struct {
	BuildVersion         int             `json:"buildVersion"`
	ConsistencyHashBytes ConsistencyHash `json:"consistencyHashBytes"`
	CreativeModeEnabled  bool            `json:"creativeModeEnabled"`
	FEditorObjectVersion int             `json:"fEditorObjectVersion"`
	IsModdedSave         BoolInt         `json:"isModdedSave"`
	MapName              string          `json:"mapName"`
	MapOptions           string          `json:"mapOptions"`
	PartitionEnabledFlag bool            `json:"partitionEnabledFlag"`
	PlayDurationSeconds  int             `json:"playDurationSeconds"`
	RawModMetadataString string          `json:"rawModMetadataString"`
	SaveDateTime         UnixTimestamp   `json:"saveDateTime"`
	SaveHeaderType       int             `json:"saveHeaderType"`
	SaveIdentifier       string          `json:"saveIdentifier"`
	SaveName             string          `json:"saveName"`
	SaveVersion          int             `json:"saveVersion"`
	SessionName          string          `json:"sessionName"`
	SessionVisibility    int             `json:"sessionVisibility"`
}

// Level represents a game level with objects and collectables
type Level struct {
	Name              string          `json:"name"`
	Objects           []GameObject    `json:"objects"`
	Collectables      []CollectedItem `json:"collectables"`
	SaveCustomVersion int             `json:"saveCustomVersion"`
}

// Transform represents position, rotation and scale in 3D space
type Transform struct {
	Translation Vector3D `json:"translation"`
	Rotation    Vector4D `json:"rotation"`
	Scale3D     Vector3D `json:"scale3D"`
}

// Vector3D represents a 3D vector (x, y, z)
type Vector3D struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
	Z float64 `json:"z"`
}

// Vector4D represents a 4D vector/quaternion (x, y, z, w)
type Vector4D struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
	Z float64 `json:"z"`
	W float64 `json:"w"`
}

// Entity represents entity data
type Entity struct {
	LevelName     string            `json:"levelName"`
	PathName      string            `json:"pathName"`
	NeedTransform bool              `json:"needTransform"`
	Properties    PropertyContainer `json:"properties"`
}

// Component represents an actor component
type Component struct {
	LevelName string `json:"levelName"`
	PathName  string `json:"pathName"`
}

// CollectedItem represents items that have been collected
type CollectedItem struct {
	PathName string `json:"pathName"`
}

// DestroyedActor represents actors that have been destroyed
type DestroyedActor struct {
	PathName string `json:"pathName"`
}

// ExtraObject represents additional objects in the level
type ExtraObject struct {
	InstanceName string            `json:"instanceName"`
	ClassName    string            `json:"className"`
	Properties   PropertyContainer `json:"properties"`
}

// GameMode represents the current game mode settings
type GameMode struct {
	InstanceName string            `json:"instanceName"`
	ClassName    string            `json:"className"`
	Properties   PropertyContainer `json:"properties"`
}

// GameState represents the current game state
type GameState struct {
	InstanceName string            `json:"instanceName"`
	ClassName    string            `json:"className"`
	Properties   PropertyContainer `json:"properties"`
}

// LevelScriptActor represents the level script actor
type LevelScriptActor struct {
	InstanceName string            `json:"instanceName"`
	ClassName    string            `json:"className"`
	Properties   PropertyContainer `json:"properties"`
}

// ObjectHeader represents object header information
type ObjectHeader struct {
	InstanceName string `json:"instanceName"`
	ClassName    string `json:"className"`
	Reference    string `json:"reference"`
}

// SessionSettings represents session configuration
type SessionSettings struct {
	SessionName string            `json:"sessionName"`
	Properties  PropertyContainer `json:"properties"`
}

// SubLevel represents a sub-level within the main level
type SubLevel struct {
	Name       string            `json:"name"`
	Properties PropertyContainer `json:"properties"`
}

// CompressionInfo contains compression-related metadata
type CompressionInfo struct {
	ChunkHeaderVersion              int `json:"chunkHeaderVersion"`
	PackageFileTag                  int `json:"packageFileTag"`
	MaxUncompressedChunkContentSize int `json:"maxUncompressedChunkContentSize"`
	CompressionAlgorithm            int `json:"compressionAlgorithm"`
}

// UnresolvedWorldSaveData contains raw world data that couldn't be parsed
type UnresolvedWorldSaveData struct {
	LevelName string `json:"levelName"`
	PathName  string `json:"pathName"`
}

// ParseFromJSON parses a JSON file into the SaveFile structure
func (sf *SaveFile) UnmarshalJSON(jsonData []byte) error {
	type SaveAlias SaveFile
	aux := &struct {
		*SaveAlias
	}{
		SaveAlias: (*SaveAlias)(sf),
	}
	err := json.Unmarshal(jsonData, aux)
	if err != nil {
		return err
	}
	sf.cachedObjects = make(map[string]*GameObject)
	sf.circuitCache = make(map[string]*GameObject)
	for _, level := range sf.Levels {
		for _, gameObject := range level.Objects {
			gameObject.cacheData()
			sf.cachedObjects[gameObject.InstanceName] = &gameObject

			if gameObject.TypePath == "/Script/FactoryGame.FGPowerCircuit" {
				components, ok := gameObject.Properties.ObjectArrayProperties["mComponents"]
				if !ok {
					return fmt.Errorf("missing mComponents in power circuit")
				}

				for _, component := range components.Values {
					sf.circuitCache[component.PathName] = &gameObject
				}
			}
		}
	}

	return nil
}

// ToJSON converts the SaveFile structure to JSON
func (sf *SaveFile) ToJSON() ([]byte, error) {
	return json.MarshalIndent(sf, "", "  ")
}

// Property represents a base property structure in Satisfactory saves
type Property struct {
	Type   string `json:"type"`
	UEType string `json:"ueType"`
	Name   string `json:"name"`
}

// BoolProperty represents a boolean property
type BoolProperty struct {
	Property
	Value bool `json:"value"`
}

// Int32Property represents a 32-bit integer property
type Int32Property struct {
	Property
	Value int32 `json:"value"`
}

// Uint32Property represents an unsigned 32-bit integer property
type Uint32Property struct {
	Property
	Value uint32 `json:"value"`
}

// FloatProperty represents a floating point property
type FloatProperty struct {
	Property
	Value float64 `json:"value"`
}

// StrProperty represents a string property
type StrProperty struct {
	Property
	Value string `json:"value"`
}

// ObjectReference represents an object reference with level and path
type ObjectReference struct {
	LevelName string `json:"levelName"`
	PathName  string `json:"pathName"`
}

// ObjectProperty represents an object property with a reference
type ObjectProperty struct {
	Property
	Value ObjectReference `json:"value"`
}

// ObjectArrayProperties represents an array of object references
type ObjectArrayProperties struct {
	Property
	SubType string            `json:"subtype"`
	Values  []ObjectReference `json:"values"`
}

// EnumValue represents an enum value
type EnumValue struct {
	Name  string `json:"name"`
	Value string `json:"value"`
}

// EnumProperty represents an enumeration property
type EnumProperty struct {
	Property
	Value EnumValue `json:"value"`
}

// ByteValue represents a byte property value
type ByteValue struct {
	Type  string `json:"type"`
	Value int    `json:"value"`
}

// ByteProperty represents a byte property
type ByteProperty struct {
	Property
	Value ByteValue `json:"value"`
}

// StructProperty represents a structured property
type StructProperty struct {
	Property
	Subtype string                 `json:"subtype"`
	Value   map[string]interface{} `json:"value"`
}

// StructArrayProperty represents an array of structured properties
type StructArrayProperty struct {
	Property
	Subtype           string                   `json:"subtype"`
	StructValueFields map[string]string        `json:"structValueFields"`
	Values            []map[string]interface{} `json:"values"`
}

// MapProperty represents a map property
type MapProperty struct {
	Property
	KeyType   string                   `json:"keyType"`
	ValueType string                   `json:"valueType"`
	ModeType  int                      `json:"modeType"`
	ModeUnk2  string                   `json:"modeUnk2"`
	ModeUnk3  string                   `json:"modeUnk3"`
	Values    []map[string]interface{} `json:"values"`
}

// Uint32SetProperty represents a set of unsigned 32-bit integers
type Uint32SetProperty struct {
	Property
	Subtype string   `json:"subtype"`
	Values  []uint32 `json:"values"`
}

// PropertyContainer holds all possible property types organized by type
type PropertyContainer struct {
	BoolProperties        map[string]BoolProperty          `json:"boolProperties,omitempty"`
	Int32Properties       map[string]Int32Property         `json:"int32Properties,omitempty"`
	Uint32Properties      map[string]Uint32Property        `json:"uint32Properties,omitempty"`
	FloatProperties       map[string]FloatProperty         `json:"floatProperties,omitempty"`
	StrProperties         map[string]StrProperty           `json:"strProperties,omitempty"`
	ObjectProperties      map[string]ObjectProperty        `json:"objectProperties,omitempty"`
	ObjectArrayProperties map[string]ObjectArrayProperties `json:"objectArrayProperties,omitempty"`
	EnumProperties        map[string]EnumProperty          `json:"enumProperties,omitempty"`
	ByteProperties        map[string]ByteProperty          `json:"byteProperties,omitempty"`
	StructProperties      map[string]StructProperty        `json:"structProperties,omitempty"`
	StructArrayProperties map[string]StructArrayProperty   `json:"structArrayProperties,omitempty"`
	MapProperties         map[string]MapProperty           `json:"mapProperties,omitempty"`
	Uint32SetProperties   map[string]Uint32SetProperty     `json:"uint32SetProperties,omitempty"`
}

// UnmarshalJSON implements custom JSON unmarshaling for PropertyContainer
func (pc *PropertyContainer) UnmarshalJSON(data []byte) error {
	// First unmarshal into a generic map to examine the structure
	var rawProps map[string]json.RawMessage
	if err := json.Unmarshal(data, &rawProps); err != nil {
		return err
	}

	// Initialize maps
	pc.BoolProperties = make(map[string]BoolProperty)
	pc.Int32Properties = make(map[string]Int32Property)
	pc.Uint32Properties = make(map[string]Uint32Property)
	pc.FloatProperties = make(map[string]FloatProperty)
	pc.StrProperties = make(map[string]StrProperty)
	pc.ObjectProperties = make(map[string]ObjectProperty)
	pc.ObjectArrayProperties = make(map[string]ObjectArrayProperties)
	pc.EnumProperties = make(map[string]EnumProperty)
	pc.ByteProperties = make(map[string]ByteProperty)
	pc.StructProperties = make(map[string]StructProperty)
	pc.StructArrayProperties = make(map[string]StructArrayProperty)
	pc.MapProperties = make(map[string]MapProperty)
	pc.Uint32SetProperties = make(map[string]Uint32SetProperty)

	// Parse each property based on its type
	for name, rawProp := range rawProps {
		var propType struct {
			Type string `json:"type"`
		}

		if err := json.Unmarshal(rawProp, &propType); err != nil {
			continue // Skip malformed properties
		}

		switch propType.Type {
		case "BoolProperty":
			var prop BoolProperty
			if err := json.Unmarshal(rawProp, &prop); err == nil {
				pc.BoolProperties[name] = prop
			}
		case "Int32Property":
			var prop Int32Property
			if err := json.Unmarshal(rawProp, &prop); err == nil {
				pc.Int32Properties[name] = prop
			}
		case "Uint32Property":
			var prop Uint32Property
			if err := json.Unmarshal(rawProp, &prop); err == nil {
				pc.Uint32Properties[name] = prop
			}
		case "FloatProperty":
			var prop FloatProperty
			if err := json.Unmarshal(rawProp, &prop); err == nil {
				pc.FloatProperties[name] = prop
			}
		case "StrProperty":
			var prop StrProperty
			if err := json.Unmarshal(rawProp, &prop); err == nil {
				pc.StrProperties[name] = prop
			}
		case "ObjectProperty":
			var prop ObjectProperty
			if err := json.Unmarshal(rawProp, &prop); err == nil {
				pc.ObjectProperties[name] = prop
			}
		case "ObjectArrayProperty":
			var prop ObjectArrayProperties
			if err := json.Unmarshal(rawProp, &prop); err == nil {
				pc.ObjectArrayProperties[name] = prop
			}
		case "EnumProperty":
			var prop EnumProperty
			if err := json.Unmarshal(rawProp, &prop); err == nil {
				pc.EnumProperties[name] = prop
			}
		case "ByteProperty":
			var prop ByteProperty
			if err := json.Unmarshal(rawProp, &prop); err == nil {
				pc.ByteProperties[name] = prop
			}
		case "StructProperty":
			var prop StructProperty
			if err := json.Unmarshal(rawProp, &prop); err == nil {
				pc.StructProperties[name] = prop
			}
		case "StructArrayProperty":
			var prop StructArrayProperty
			if err := json.Unmarshal(rawProp, &prop); err == nil {
				pc.StructArrayProperties[name] = prop
			}
		case "MapProperty":
			var prop MapProperty
			if err := json.Unmarshal(rawProp, &prop); err == nil {
				pc.MapProperties[name] = prop
			}
		case "Uint32SetProperty":
			var prop Uint32SetProperty
			if err := json.Unmarshal(rawProp, &prop); err == nil {
				pc.Uint32SetProperties[name] = prop
			}
		}
	}

	return nil
}

// UnixTimestamp represents a Unix timestamp that can be unmarshaled from either string or int
type UnixTimestamp struct {
	time.Time
}

// UnmarshalJSON implements custom JSON unmarshaling for Unix timestamps
func (ut *UnixTimestamp) UnmarshalJSON(data []byte) error {
	// Remove quotes if present
	s := string(data)
	if len(s) >= 2 && s[0] == '"' && s[len(s)-1] == '"' {
		s = s[1 : len(s)-1]
	}

	// Parse as Unix timestamp (in seconds)
	timestamp, err := strconv.ParseInt(s, 10, 64)
	if err != nil {
		return err
	}

	// Convert to time.Time (assuming the timestamp is in seconds)
	// If it's in milliseconds (> 1e12), divide by 1000
	if timestamp > 1e12 {
		timestamp = timestamp / 1000
	}

	ut.Time = time.Unix(timestamp, 0)
	return nil
}

// MarshalJSON implements custom JSON marshaling for Unix timestamps
func (ut UnixTimestamp) MarshalJSON() ([]byte, error) {
	return json.Marshal(ut.Unix())
}

// BoolInt represents a boolean value that may be stored as 0/1 in JSON
type BoolInt bool

// UnmarshalJSON implements custom JSON unmarshaling for integer booleans
func (bi *BoolInt) UnmarshalJSON(data []byte) error {
	var i int
	if err := json.Unmarshal(data, &i); err != nil {
		return err
	}
	*bi = BoolInt(i != 0)
	return nil
}

// MarshalJSON implements custom JSON marshaling for integer booleans
func (bi BoolInt) MarshalJSON() ([]byte, error) {
	if bi {
		return json.Marshal(1)
	}
	return json.Marshal(0)
}
