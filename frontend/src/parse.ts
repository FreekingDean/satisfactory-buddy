import { Parser } from '@etothepii/satisfactory-file-parser';
import { readFileSync, writeFileSync } from 'fs';

const [mapFile, jsonFile] = process.argv.slice(2)

const file = new Uint8Array(readFileSync(mapFile)).buffer;

console.log('Parsing save file:', mapFile);

const saveData = Parser.ParseSave('MySave', file);

console.log('Save file loaded, size:', file.byteLength);
console.log('Writing to JSON file:', jsonFile);

writeFileSync(jsonFile, JSON.stringify(saveData))
