import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.resolve(__dirname, '..');

// 1. Ensure node_modules/express exists
const expressPath = path.join(backendDir, 'node_modules', 'express');
if (!fs.existsSync(expressPath)) {
  console.log('[START-OR-BUILD] express not found in node_modules. Installing dependencies via npm install...');
  try {
    execSync('npm install', { cwd: backendDir, stdio: 'inherit' });
    console.log('[START-OR-BUILD] Dependencies installed successfully.');
  } catch (err) {
    console.error('[START-OR-BUILD] npm install failed:', err);
    process.exit(1);
  }
}

// 2. Check if running during Render Build phase
// On Render, process.env.RENDER is set to 'true'.
// During Build phase, process.env.PORT is NOT set (undefined).
// During Start phase (Web Service runtime), process.env.PORT is set (e.g., '10000').
const isRenderBuildPhase = Boolean(process.env.RENDER) && !process.env.PORT;

if (isRenderBuildPhase) {
  console.log('[START-OR-BUILD] Render BUILD phase detected (RENDER=true, PORT undefined). Exiting cleanly with code 0.');
  process.exit(0);
}

// 3. Start the Express server dynamically so module imports succeed
console.log('[START-OR-BUILD] Launching WeatherGPT Express backend server...');
await import('../src/server.js');
