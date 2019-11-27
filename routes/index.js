const fs = require('fs');
const path = require('path');

const multiparty = require('multiparty');
const express = require('express');

const { UPLOAD_PATH } = require('../constants/file-path');
const { generateRandomStr } = require('../utils/common');

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/random-code', function(req, res, next) {
  res.render('random-code', { title: 'Express' });
});

router.post('/upload', (req, res, next) => {
  const form = new multiparty.Form();
  form.parse(req, (err, fields, file) => {
    if (err) {
      console.error('upload fail, err: ', err);
      res.status(500).send('parse form data fail.');
      return;
    }
    console.log(fields.name[0], file.file[0]);
    console.log('target path: ', UPLOAD_PATH);

    const filePath = ((file.file || [])[0] || {}).path;
    if (!filePath) {
      console.error('file is required.');
      res.status(417).send('file is required.');
      return;
    }

    const name = (fields.name || [])[0] || generateRandomStr(4);
    const timestamp = Date.now();
    const randomStr = generateRandomStr(8);
    const fileOriginName = ((file.file || [])[0] || {}).originalFilename || generateRandomStr(8);
    const fileName = `${name}_${timestamp}_${randomStr}_${fileOriginName}`;
    const targetPath = path.join(UPLOAD_PATH, fileName);

    const readStream = fs.createReadStream(filePath);
    const writeStream = fs.createWriteStream(targetPath);
    readStream.pipe(writeStream);
    readStream.once('end', () => {
      fs.unlinkSync(filePath);

      res.send({ fileName, filePath: targetPath });
      res.end();
    });
    readStream.on('error', (err) => {
      console.error('move file fail, err: ', err);
      res.status(500).send('upload file fail.');
    });
  })
});

module.exports = router;
