const socketIO = require('socket.io');

const BUSINESS_TYPE = require('./constants/business-type');

const handleRandomCode = require('./controllers/socketio/random-code');
const handleFileAnalyze = require('./controllers/socketio/file-analyze');

const WAITING_TIME = 3000;

/**
 * add socket.io events listener
 * @param {SocketIO.Server} io - socket.io server instance
 */
const addSocketIOEventsListener = (io) => {
  io.on('connection', (socket) => {
    console.log('a new connection created, id: ', socket.id);

    // setting auto close
    let waitTimer = setTimeout(() => {
      socket.send('timeout, will disconnect.');
      socket.disconnect(true);
    }, WAITING_TIME);

    socket.on('disconnect', (reason) => {
      console.log('a connection disconnect, id: ', socket.id, 'reason: ', reason);
      clearTimeout(waitTimer);
    });

    // request business type
    socket.on('BUSINESS_TYPE', (businessType, ...args) => {
      clearTimeout(waitTimer);

      switch (businessType) {
        case BUSINESS_TYPE.FILE_ANALYZE:
          handleFileAnalyze(socket, ...args);
          break;
        case BUSINESS_TYPE.RANDOM_CODE:
          handleRandomCode(socket, ...args);
          break;
        default:
          console.log('wrong business type, kill connection...');
          socket.send('wrong business type, reject connection.');
          socket.disconnect(true)
      }
    });
  });
};

/**
 * create a socket.io server instance
 * @param {http.Server} httpServerInstance - nodejs http server instance
 */
const createSocketIOServer = (httpServerInstance) => {
  const io = socketIO(httpServerInstance);
  addSocketIOEventsListener(io);
};

module.exports = createSocketIOServer;
