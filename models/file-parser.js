const fs = require('fs');
const readline = require('readline');

class FileParser {
  /**
   * @constructor
   * @param {string} filePath - file path
   * @param {NodeJS.EventEmitter} eventEmitter - notify eventEmitter
   */
  constructor (filePath, eventEmitter) {
    this.filePath = filePath;
    this.eventEmitter = eventEmitter;
  }

  /**
   * start parse file
   */
  parse () {
    const readStream = fs.createReadStream(this.filePath);
    const readlineInterface = readline.createInterface({
      input: readStream
    });

    readlineInterface.on('close', () => {
      console.log('readline complete.');
      this.handleComplete();

      fs.unlinkSync(this.filePath);
    });
    readlineInterface.on('line', (line) => {
      try {
        // TODO: you can write parsing logic here

        this.handleResult(line);
      } catch (err) {
        console.error('parse fail. err: ', err);
        this.handleError(err);
      }
    });
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
