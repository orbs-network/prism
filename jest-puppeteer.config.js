const debug = process.env.DEBUG_E2E === 'true';

module.exports = {
  launch: {
    headless: !debug,
    dumpio: true,
  },
  server: {
    command: 'npm run start:prod',
    port: 3000,
    debug,
  },
};
