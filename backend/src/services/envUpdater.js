import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '../../.env');

/**
 * Automatically updates backend/.env file with new Email & Phone number
 */
export const updateEnvVars = (newVars = {}) => {
  try {
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    const lines = envContent.split('\n');
    const envMap = new Map();

    // Parse existing .env lines
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const parts = trimmed.split('=');
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        envMap.set(key, value);
      }
    });

    // Update with new values
    Object.keys(newVars).forEach((key) => {
      if (newVars[key] !== undefined && newVars[key] !== null) {
        envMap.set(key, newVars[key]);
      }
    });

    // Reconstruct .env content
    let updatedContent = `# Environment Configuration - Auto-Updated at ${new Date().toISOString()}\n`;
    envMap.forEach((val, key) => {
      updatedContent += `${key}=${val}\n`;
    });

    fs.writeFileSync(envPath, updatedContent, 'utf8');
    console.log(`[ENV Auto-Updater] Automatically updated backend/.env with latest dispatch credentials!`);
    return true;
  } catch (error) {
    console.error(`[ENV Auto-Updater Error] Failed to update .env: ${error.message}`);
    return false;
  }
};
