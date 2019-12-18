const userStatus = {
  regular: 'regular',
  worker: 'worker',
};

// Searching for the executor/client
const participantStatus = {
  active: 'active',
  fulfilled: 'fulfilled',
  rejected: 'rejected',
};

const sendStatus = {
  active: 'active',
  rejected: 'rejected',
  fulfilled: 'fulfilled',
};

const productStatus = {
  active: 'active',
  progress: 'progress',
  paused: 'paused',
  finished: 'finished',
};

const notifications = {
  workerJobReq: 'workerJobReq',
  customerJobRes: 'customerJobRes',
  customerJobReq: 'customerJobReq',
  workerJobRes: 'workerJobRes,',
  messages: 'messages',
};

const identityType = {
  driversLicense: 'driversLicense',
  passport: 'passport',
  identityCard: 'identityCard',
  certificate: 'certificate',
};

module.exports = {
  userStatus,
  participantStatus,
  sendStatus,
  productStatus,
  notifications,
  identityType,
};

