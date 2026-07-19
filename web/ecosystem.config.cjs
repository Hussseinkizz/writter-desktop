const path = require('path');

const port = process.env.PORT || 3009;

/** @type {import('pm2').StartOptions} */
module.exports = {
  apps: [
    {
      name: 'writter',
      cwd: __dirname,
      // Run Next directly — never `pm2 start pnpm -- start` or `pm2 start npm -- start`.
      // Wrappers exit immediately and PM2 restarts in a loop (high CPU, rising ↺ count).
      script: path.join(__dirname, 'node_modules/next/dist/bin/next'),
      args: `start -H 0.0.0.0 -p ${port}`,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 4000,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: port,
      },
    },
  ],
};
