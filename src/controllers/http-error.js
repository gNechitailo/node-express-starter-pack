const makeError = (code, why) => {
  const error = new Error('Something went wrong');

  console.log('At make error');
  console.log(why);
  error.data = why;
  error.code = code;

  return error;
};

makeError.bind = code => why => makeError(code, why);

module.exports = makeError;


