import isEmpty from 'lodash/isEmpty';

const BASE = 'CaloTracking';

const COLOURS = {
  trace: 'lightblue',
  info: 'blue',
  warn: 'pink',
  error: 'red',
};

class Log {

  constructor() {
    this.debug = require('debug');
    if (process.env.NODE_ENV !== 'production') {
      const debug = this.debug.load();
      if (isEmpty(debug) && typeof localStorage !== 'undefined') localStorage.setItem('debug', 'caloTracking:*');
    }
  }

  load() {
    return this.debug.load();
  }

  update() {
    this.debug.enable(this.debug.load());
  }

  generateMessage(level, ...args) {
    // Set the prefix which will cause debug to enable the message
    const namespace = `${BASE}:${level}`;
    const createDebug = this.debug(namespace);

    // Set the colour of the message based on the level
    createDebug.color = COLOURS[level];

    createDebug(...args);
  }

  trace(...args) {
    return this.generateMessage('trace', ...args);
  }

  info(...args) {
    return this.generateMessage('info', ...args);
  }

  warn(...args) {
    return this.generateMessage('warn', ...args);
  }

  error(...args) {
    return this.generateMessage('error', ...args);
  }
}

export default new Log();
