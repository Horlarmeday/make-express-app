import BaseError from './baseError';

class APIError extends BaseError {
  constructor(name, httpCode, message = 'internal server error') {
    super(name, httpCode, message);
  }
}

export default APIError;