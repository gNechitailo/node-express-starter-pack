const templates = {
  activateAccount: require('./activateAccount'),
  resetPassword: require('./resetPassword'),
};

module.exports = (template, user) => templates[template](user);
