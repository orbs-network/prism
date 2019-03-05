module.exports = {
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  SERVER_PORT: process.env.PORT || 3000,
  POSTGRES_URL: process.env.POSTGRES_URL,
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_TYPE: process.env.DATABASE_TYPE,
  ORBS_ENDPOINT: process.env.ORBS_ENDPOINT,
  ORBS_VIRTUAL_CHAIN_ID: parseInt(process.env.ORBS_VIRTUAL_CHAIN_ID),
  ORBS_NETWORK_TYPE: process.env.ORBS_NETWORK_TYPE,
  POOLING_INTERVAL: parseInt(process.env.POOLING_INTERVAL),
};
