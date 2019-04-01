const { MONGODB_URI } = require('./src/server/config');

if (MONGODB_URI.toLocaleString().indexOf('localhost') === -1) {
  console.error(`
  *********************************************************************************************
  Your MONGODB_URI is not pointing to localhost, we don't want to run tests on production db...
  *********************************************************************************************
  `);
  process.exit(1);
}
