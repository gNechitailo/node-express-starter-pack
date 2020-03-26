const HttpStatus = require('http-status-codes');
const debug = require('debug')('App:HttpError');

class HttpError extends Error {
  constructor(code, why) {
    super(why);
    this.data = why;
    this.code = code;
    debug('At make error', why);
  }

  static withCode(code) {
    return (why) => new HttpError(code, why);
  }

  static unprocessableEntity(why) {
    return new HttpError(HttpStatus.UNPROCESSABLE_ENTITY, why);
  }

  static badRequest(why) {
    return new HttpError(HttpStatus.BAD_REQUEST, why);
  }

  static notFound(why) {
    return new HttpError(HttpStatus.NOT_FOUND, why);
  }

  static forbidden(why) {
    return new HttpError(HttpStatus.FORBIDDEN, why);
  }

  static unauthorized(why) {
    return new HttpError(HttpStatus.UNAUTHORIZED, why);
  }
}

module.exports = HttpError;
