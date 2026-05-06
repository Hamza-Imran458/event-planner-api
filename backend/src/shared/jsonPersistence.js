const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');

function persistEnabled() {
  return process.env.NODE_ENV !== 'test';
}

function loadJsonFile(filename, fallback) {
  if (!persistEnabled()) return fallback;
  const filePath = path.join(DATA_DIR, filename);
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveJsonFile(filename, data) {
  if (!persistEnabled()) return;
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
  loadJsonFile,
  saveJsonFile,
  persistEnabled,
  DATA_DIR,
};
