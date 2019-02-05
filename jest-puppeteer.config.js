const debug = process.env.DEBUG_E2E === 'true';

module.exports = {
  launch: {
    headless: !debug,
  },
  server: {
    command: 'npm start',
    port: 3000,
    debug,
  },
};
