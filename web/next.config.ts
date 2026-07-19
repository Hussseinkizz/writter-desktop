import type { NextConfig } from 'next';
import path from 'path';
import { fileURLToPath } from 'url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Monorepo: Next lives in web/, repo root has its own lockfile.
  outputFileTracingRoot: path.join(rootDir, '..'),
  turbopack: {
    root: rootDir,
  },
};

export default nextConfig;
