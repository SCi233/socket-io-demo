const fs = require('fs');

class FileParser {
  /**
   * @constructor
   * @param {string} filePath - file path
   * @param {NodeJS.EventEmitter} eventEmitter - notify eventEmitter
   */
  constructor (filePath, eventEmitter) {
    this.filePath = filePath;
    this.eventEmitter = eventEmitter;

    this.stopFlag = false;
  }

  fakeParse () {
    return new Promise((resolve) => {
      setTimeout(resolve, 1);
    });
  }

  /**
   * start parse file
   */
  parse () {
    fs.readFile(this.filePath, { encoding: 'utf8' }, async (err, text) => {
      if (err) {
        console.error('read file fail. err: ', err);
        this.handleError(err);
        return;
      }


      // TODO: use os.EOL
      try {
        const lines = text.split('\n');
        console.log(lines.length);
        for (let i = 0; i < lines.length; ++i) {
          if (this.stopFlag) {
            return;
          }

          // TODO: write parse logic here

          // fake parse
          await this.fakeParse();

          if (i % 1000 === 0) {
            this.handleResult(`${i}/${lines.length}`);
          }
        }
      } catch (err) {
        console.error('parse file fail. err: ', err);
        this.handleError(err);
      }

      console.log('parse file complete.');
      this.handleComplete();
      fs.unlinkSync(this.filePath);
    });
  }

  stopParse () {
    this.stopFlag = true;
  }

  /**
   * handle parse result
   * @param {string} text - parse result
   */
  handleResult (text) {
    this.eventEmitter.emit('message', text);
  }

  /**
   * handle parse complete
   */
  handleComplete () {
    this.eventEmitter.emit('complete');
  }

  /**
   * handle parse fail
   * @param {Error} err - error
   */
  handleError (err) {
    this.eventEmitter.emit('error', err);
  }
}

module.exports = FileParser;
