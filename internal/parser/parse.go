package parser

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/exec"
	"path"

	"github.com/FreekingDean/satisfactory-buddy/internal/savefile"
)

func Parse(mapPath string, jsonPath string) (savefile.SaveFile, error) {
	var saveFile savefile.SaveFile
	filename := path.Base(mapPath)
	jsonFilename := path.Join(jsonPath, filename+".json")
	cmd := exec.Command("npm", "run", "parse", mapPath, jsonFilename)
	cmd.Dir = "./frontend"
	buffer := new(bytes.Buffer)
	cmd.Stdout = buffer
	errBuffer := new(bytes.Buffer)
	cmd.Stderr = errBuffer
	err := cmd.Run()

	if cmd.ProcessState.ExitCode() != 0 || err != nil {
		return saveFile, fmt.Errorf("failed to parse save file (%s): \nstderr:\n%s\nstdout:\n%s", err.Error(), errBuffer.String(), buffer.String())
	}

	file, err := os.Open(jsonFilename)
	if err != nil {
		return saveFile, fmt.Errorf("failed to open save file: %w", err)
	}
	defer file.Close()

	log.Println("Loading save file...")
	decoder := json.NewDecoder(file)
	return saveFile, decoder.Decode(&saveFile)
}
