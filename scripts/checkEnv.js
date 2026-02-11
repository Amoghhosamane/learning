#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Try to load .env.local if it exists (so developers don't need dotenv installed)
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^\s*([^#][^=]+)=(.*)$/);
    if (match) {
      let key = match[1].trim();
      let val = match[2].trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      process.env[key] = val;
    }
  });
}

const required = ['MONGO_URI', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL'];
const missing = required.filter((k) => !process.env[k]);

if (missing.length > 0) {
  console.error('\n❌ Missing required environment variables: ' + missing.join(', '));
  console.error('\nAdd them to a local .env.local file (DO NOT commit) or set them in your environment.');
  console.error('\nCreate a .env.local from .env.local.example and fill in your values.\n');
  process.exit(1);
}

console.log('✅ Required environment variables found.');
process.exit(0);
