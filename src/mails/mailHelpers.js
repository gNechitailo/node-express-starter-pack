const { frontendOrigin } = require('../config');

module.exports = {
  makeLink(absolutePath) {
    return frontendOrigin + absolutePath;
  },
};
