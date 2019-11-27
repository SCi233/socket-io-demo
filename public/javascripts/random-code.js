let progressPannel;
const appendPannelText = (text) => {
  progressPannel || (progressPannel = document.getElementById('progress-pannel') || {});
  progressPannel.value += `${text}\n`;

  const scrollHeight = progressPannel.scrollHeight;
  progressPannel.scrollTop = scrollHeight;
};

function handleClick () {
  console.log('handleClick');

  progressPannel || (progressPannel = document.getElementById('progress-pannel') || {});
  progressPannel.value = '';

  appendPannelText('start upload file...');
  uploadFile()
    .then((fileName) => {
      const socket = io();
      socket.on('message', (msg) => {
        // console.log('message: ', msg);
        appendPannelText(`parsing result: ${msg}`);
      });
      socket.on('connect', () => {
        appendPannelText('connect to server, start parsing task.');
        socket.emit('BUSINESS_TYPE', 1001, fileName);
      });
    })
}

let socket;
let interval;

function handleStartBtnClick () {
  if (socket) {
    return;
  }

  socket = io();
  socket.on('message', (msg) => {
    // console.log('message: ', msg);
    appendPannelText(`random code: ${msg}`);
  });
  socket.on('connect', () => {
    appendPannelText('connect to server, start request random code.');
    interval = setInterval(() => {
      socket.emit('BUSINESS_TYPE', 1002, 16);
    }, 1000);
  });
}

function handleStopBtnClick () {
  if (socket) {
    clearInterval(interval);
    socket.close();
    socket = null;
  }
}