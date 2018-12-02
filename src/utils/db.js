const mongoose = require('mongoose');
const config = require('config');
const logger = require('libs/logger')(module);


const isProduction = process.env.NODE_ENV === 'production';
const url = (isProduction) ? process.env.DB_URI : config.get('mongoose.uri');
const options = (isProduction) ? {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  useNewUrlParser: true,
  authSource: 'admin',
} : config.get('mongoose.options');

logger.debug(JSON.stringify(options));

mongoose.connect(url, options);
const db = mongoose.connection;

db.once('open', () => {
  logger.info('Connected to MongoDB!');
});

db.on('error', (err) => {
  logger.error(err.message);
});

module.exports = mongoose;
