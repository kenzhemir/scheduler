/* Packages */
const express = require('express');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const router = require('./routes');
const errors = require('./utils/errors');
require('./utils/db');


/* Create app */
const app = express();

/* Set up view engine */
app.set('view engine', 'html');
app.engine('html', (_path, _options, callback) => {
  fs.readFile(_path, 'utf-8', callback);
});

/* Request body parser */
app.use(express.json());
app.use(express.urlencoded({
  extended: false,
}));

/* Set up logger (morgan) */
const logDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}
const accessLogStream = rfs('requests.log', {
  interval: '1d', // rotate daily
  path: logDirectory,
});
switch (process.env.NODE_ENV) {
  case 'production':
    app.use(morgan('combined', {
      stream: accessLogStream,
    }));
    break;
  default:
    app.use(morgan('dev'));
}


/* Serve API documentation */
app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/views/index.html`));
});

app.use('/api', router);

app.use(errors.errorHandler);

module.exports = app;
