const EventEmitter = require('events');
const path = require('path');

const { UPLOAD_PATH } = require('../../constants/file-path');
const FileParser = require('../../models/file-parser');

/**
 * file parsing business handler
 * @param {SocketIO.Socket} socket
 * @param {string} fileName - file name
 */
const handleFileAnalyze = (socket, fileName) => {
  console.log('fileName: ', fileName);
  const filePath = path.join(UPLOAD_PATH, fileName);

  const e = new EventEmitter();
  e.on('message', (msg) => {
    socket.send(msg);
  });
  e.on('complete', () => {
    socket.send('parse complete');
    socket.disconnect(true);
  });
  e.on('error', (err) => {
    socket.send('parse fail, err: ' + err);
    socket.disconnect(true);
  });

  const fileParser = new FileParser(filePath, e);
  fileParser.parse();
};

module.exports = handleFileAnalyze;
