const { Notifications } = require('../models');

module.exports = {
  list(id) {
    return Notifications
      .findAll({
        where: { userId: id },
        order: [['viewed', 'DESC'], ['createdAt', 'DESC']],
      });
  },
  listOfTypes(id, type) {
    return Notifications
      .findAll({
        where: {
          userId: id,
          type,
        },
        order: [['viewed', 'DESC'], ['createdAt', 'DESC']],
      });
  },
  checkNotification(userId, ids) {
    return Notifications
      .update(
        { viewed: true },
        {
          where: {
            userId,
            id: ids,
          },
        },
      );
  },
};
