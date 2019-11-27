let progressPannel;
const appendPannelText = (text) => {
  progressPannel || (progressPannel = document.getElementById('progress-pannel') || {});
  progressPannel.value += `${text}\n`;

  const scrollHeight = progressPannel.scrollHeight;
  progressPannel.scrollTop = scrollHeight;
};

/**
 * upload file
 * @returns {Promise<{fileName: string}>} - filename
 */
const uploadFile = () => {
  const fileInput = document.getElementById('fileInput') || {};
  const file = (fileInput.files || [])[0];
  console.log('fileInput: ', file);

  const param = new FormData();
  param.append('name', 'testFile');
  param.append('file', file);
  console.log(param.get('file'));

  if (!axios) {
    console.error('axios is required.');
    appendPannelText('[ERROR] upload fail, axios is required but not found.');
    return;
  }

  return axios.post('/upload', param, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      console.log('onUploadProgress e: ', e);
      appendPannelText(`upload progress: ${e.loaded}/${e.total}`);
    }
  }).then(res => {
    console.log('upload complete, res: ', res);
    if (res.status !== 200) {
      throw new Error('upload fail.');
    }

    appendPannelText('** upload file complete. **');
    appendPannelText('start parsing file...');
    return res.data.fileName || '';
  }).catch(err => {
    console.error('upload fail! err: ', err);
    appendPannelText('[ERROR] upload file fail. ' + err);
  });
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
