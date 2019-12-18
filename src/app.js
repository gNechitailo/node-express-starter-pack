// Const createError = require('http-errors');

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cron = require('node-cron');
const HttpStatus = require('http-status-codes');
const debug = require('debug')('MyApp:app');
const cors = require('cors');
const sender = require('./services/mailService');

const routerV1 = require('./routes');

const app = express();
const WS_PORT = 8080;

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(require('body-parser').urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept, Authorization');
  next();
});
app.use(cors({ origin: '*' }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1', routerV1);

app.use(express.static(path.join(__dirname, 'public')));

const WebSocket = require('ws');

const wserver = new WebSocket.Server({ port: WS_PORT });

const users = new Map();

wserver.on('connection', ws => {
  ws.on('message', messageText => {
    const message = JSON.parse(messageText);


    debug(message);

    if (message.type === 'SUBSCRIBE') {
      users.set(message.id, ws);
    }
  });

  ws.send('Welcome');
});

app.post('/send-message', (req, res) => {
  debug(req.body);
  const { body: { id, text } } = req;

  const socket = users.get(id);

  if (!socket) {
    res.sendStatus(HttpStatus.OK);

    return;
  }

  socket.send(JSON.stringify({ type: 'MESSAGE', text }));
  res.sendStatus(HttpStatus.OK);
});

// Catch 404 and forward to error handler
app.use((req, res) => {
  res.sendStatus(HttpStatus.NOT_FOUND);
});


cron.schedule('*/10 * * * * *', () => {
  sender.sendMail();
}).start();


// Error handler
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  res.status(HttpStatus.INTERNAL_SERVER_ERROR)
    .json({ error: 'Unexpected structure error', debug: error.message });
});

module.exports = app;
