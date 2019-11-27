const { generateRandomStr } = require('../../utils/common');

/**
 * random code business handler
 * @param {SocketIO.Socket} socket
 * @param {number} length - random number length
 */
const handleRandomCode = (socket, length) => {
  const randomCode = generateRandomStr(length);
  socket.send(randomCode);
};

module.exports = handleRandomCode;
