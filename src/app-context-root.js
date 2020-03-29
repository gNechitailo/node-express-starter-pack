const awilix = require('awilix');
const nodemailer = require('nodemailer');
const debug = require('debug')('AppContextRoot');

const models = require('./models');
const config = require('./config');
const { makeAuthService, makeUserService, makeMailService } = require('./services');
const { makeAuthController, makeUserController } = require('./controllers');
const makeJwtCheckMiddleware = require('./middleware/jwtcheck');

const makeUserRouter = require('./routes/user');
const makeAuthRouter = require('./routes/auth');
const makeRootRouter = require('./routes/root');

const PeriodicJobsRunner = require('./periodic-jobs-runner');

function registerModels(container) {
  container.register({ models: awilix.asValue(models) });
}

async function makeMailTransorter() {
  if (process.env === 'production') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.mailUser,
        pass: config.mailPass,
      },
    });
  }

  const testAccount = await nodemailer.createTestAccount();

  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: config.smtpPort,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

async function registerServices(container) {
  const mailTransporter = await makeMailTransorter();

  container.register({
    mailTransporter: awilix.asValue(mailTransporter),
    authService: awilix.asFunction(makeAuthService).singleton(),
    userService: awilix.asFunction(makeUserService).singleton(),
    mailService: awilix.asFunction(makeMailService).singleton(),
  });
}

function registerControllers(container) {
  container.register({
    authController: awilix.asFunction(makeAuthController).singleton(),
    userController: awilix.asFunction(makeUserController).singleton(),
    jwtCheck: awilix.asFunction(makeJwtCheckMiddleware).singleton(),
  });
}

function registerRouters(container) {
  container.register({
    userRouter: awilix.asFunction(makeUserRouter).singleton(),
    authRouter: awilix.asFunction(makeAuthRouter).singleton(),
    rootRouter: awilix.asFunction(makeRootRouter).singleton(),
  });
}

async function initAppContext() {
  debug('Starting dependencies configuration');

  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY,
  });

  registerModels(container);
  await registerServices(container);
  registerControllers(container);
  registerRouters(container);

  container.register({
    periodicJobsRunner: awilix.asClass(PeriodicJobsRunner),
  });

  debug('All the dependencies are constructed and Injected properly');

  return container;
}

module.exports = initAppContext;
