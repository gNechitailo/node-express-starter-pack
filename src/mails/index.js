const templates = {
  activateAccount: require('./activateAccount'),
  resetPassword: require('./resetPassword'),
};

module.exports = (template, user, additionalInfo) => templates[template](user, additionalInfo);
