function wrap(handler) {
  return async function(req, res, next) {
    try {
      await handler(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
}

// Waiting for @decorators in stable
const wrapController = (controller) => {
  Object.keys(controller).forEach((handlerKey) => {
    controller[handlerKey] = wrap(controller[handlerKey]);
  });
};

module.exports = {
  wrap,
  wrapController,
};
