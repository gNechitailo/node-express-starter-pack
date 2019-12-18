const wrap = handler => async(req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (error) {
    return next(error);
  }
};

const wrapController = controller => {
  const result = {};

  Object.keys(controller).forEach(handlerKey => {
    result[handlerKey] = wrap(controller[handlerKey]);
  });

  return result;
};

module.exports = {
  wrap,
  wrapController,
};
