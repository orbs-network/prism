module.exports = {
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  SERVER_PORT: process.env.PORT || 3000,
  ORBS_ENDPOINT: process.env.ORBS_ENDPOINT,
  ORBS_VIRTUAL_CHAIN_ID: parseInt(process.env.ORBS_VIRTUAL_CHAIN_ID),
  ORBS_NETWORK_TYPE: process.env.ORBS_NETWORK_TYPE,
};
