const isDebugEnabled = process.env.DEBUG === 'true';
const isInfoEnabled = process.env.INFO === 'true';

const getTimestamp = () => {
  return new Date().toISOString(); // ISO format timestamp
};

const logger = {
  log: (...args) => {
      console.log(`[${getTimestamp()}]`, ...args);
  },
  info: (...args) => {
    if (isInfoEnabled || isDebugEnabled) {
      console.info(`[${getTimestamp()}]`, ...args);
    }
  },
  error: (...args) => {
    if (isDebugEnabled) {
      console.error(`[${getTimestamp()}]`, ...args);
    }
  },
};

module.exports = logger;