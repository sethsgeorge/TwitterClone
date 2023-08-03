import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current module's file path
const __filename = fileURLToPath(import.meta.url);

// Calculate the directory name based on the file path
const __dirname = path.dirname(__filename);

const logFilePath = path.join(__dirname, "app.log");

const logStream = fs.createWriteStream(logFilePath, { flags: "a" });

console.log = (message) => {
  logStream.write(`${message}\n`);
};
