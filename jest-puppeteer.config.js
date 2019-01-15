module.exports = {
  launch: {
    headless: true,
  },
  server: {
    command: 'NODE_ENV=production npm start',
    port: 3000,
  },
};
