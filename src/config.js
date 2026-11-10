'use strict';
/**
 * config.js: env + config/source.json loader. Who the expert is, what they can
 * credibly speak to and what a pitch may never say all live outside the code.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
require('dotenv').config({ path: path.join(ROOT, '.env'), override: true, quiet: true });

const CONFIG_DIR = process.env.CONFIG_DIR || path.join(ROOT, 'config');
const STATE_DIR  = process.env.STATE_DIR  || path.join(ROOT, 'state');
if (!fs.existsSync(STATE_DIR)) fs.mkdirSync(STATE_DIR, { recursive: true });

function loadConfig(name) {
  for (const file of [`${name}.json`, `${name}.example.json`]) {
    const p = path.join(CONFIG_DIR, file);
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  }
  throw new Error(`Missing ${path.join(CONFIG_DIR, name + '.json')}`);
}

const source = loadConfig('source');

module.exports = { ROOT, CONFIG_DIR, STATE_DIR, source };
