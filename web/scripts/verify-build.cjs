const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '../.next/routes-manifest.json');

if (!fs.existsSync(manifestPath)) {
  console.error('\nMissing production build. Run: pnpm build\n');
  process.exit(1);
}

let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
} catch {
  console.error('\nInvalid build output. Run: pnpm build:clean\n');
  process.exit(1);
}

if (!Array.isArray(manifest.onMatchHeaders)) {
  console.error(
    '\nStale Next.js build (missing onMatchHeaders in routes manifest).\n' +
      'Run: pnpm build:clean\n'
  );
  process.exit(1);
}
