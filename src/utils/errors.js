const logger = require('libs/logger')(module);

const ERROR_DOCS_URL = 'https://gitlab.com/hq-team/hq-back/wikis/API/Error-codes';

const errorHandler = (req, res, next, err) => {
  // res.send(err.userMessage);
  logger.error(`[${err.errorCode || 'internal'}] ${err.devMessage || err.message}`);
};

class GenericError extends Error {
  constructor(devMessage, userMessage, errorCode, moreInfo) {
    super();
    this.devMessage = devMessage;
    this.userMessage = userMessage;
    this.errorCode = errorCode;
    this.moreInfo = moreInfo || `${ERROR_DOCS_URL}#${this.errorCode}`;
  }
}

class BadRequest extends GenericError {
  constructor(devMessage, userMessage, errorCode, moreInfo) {
    super(devMessage, userMessage, errorCode, moreInfo);
    this.status = 400;
  }
}
class InternalServerError extends GenericError {
  constructor(devMessage, userMessage, errorCode, moreInfo) {
    super(devMessage, userMessage, errorCode, moreInfo);
    this.status = 500;
  }
}

const noEmailPasswordOrUsername = new BadRequest(
  'Email, username or password were not sent to API endpoint',
  'E-mail, username and password are required!',
  '001',
);

const userAlreadyExists = new BadRequest(
  'There is already user with such e-mail in database',
  'User with provided e-mail already exists',
  '002',
);

const databaseError = mongoError => new InternalServerError(
  `Database error occured. See server logs @[${Date.now()}]. 
    Error: ${mongoError.name}`,
  'Database error occured',
  '100',
);

module.exports = {
  errorHandler,
  noEmailPasswordOrUsername,
  userAlreadyExists,
  databaseError,
};
