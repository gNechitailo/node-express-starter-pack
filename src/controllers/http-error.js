const HttpStatus = require('http-status-codes');

const makeError = (code, why) => {
  const error = new Error('Something went wrong');

  console.log('At make error');
  console.log(why);
  error.data = why;
  error.code = code;

  return error;
};

makeError.bind = code => why => makeError(code, why);

makeError.unprocessableEntity = makeError.bind(HttpStatus.UNPROCESSABLE_ENTITY);
makeError.badRequest = makeError.bind(HttpStatus.BAD_REQUEST);

module.exports = makeError;


