const jwt = require('jsonwebtoken');

const FORBIDDEN = 403;

module.exports = {
  ensureToken(req, res, next) {
    const { headers: { authorization } } = req;
    const jwtHeader = authorization;

    if (typeof jwtHeader === 'undefined') {
      res.sendStatus(FORBIDDEN);

      return;
    }

    const JWT = jwtHeader.split(' ');
    const jwtToken = JWT[1];

    jwt.verify(jwtToken, 'nodeauthsecret', err => {
      if (err) {
        res.sendStatus(FORBIDDEN);

        return;
      }
      const decodedToken = jwt.decode(jwtToken);

      req.userId = decodedToken.id;
      next();
    });
  },
};
