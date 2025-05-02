const isDebugEnabled = process.env.DEBUG === 'true';

const logger = {
  log: (...args) => {
    if (isDebugEnabled) {
      console.log(...args);
    }
  },
  error: (...args) => {
    if (isDebugEnabled) {
      console.error(...args);
    }
  },
};

module.exports = logger;