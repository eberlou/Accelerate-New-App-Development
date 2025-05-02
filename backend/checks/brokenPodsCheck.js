const { exec } = require('child_process');
const logger = require('../logger'); // Import the logger

// Helper function to execute shell commands
const execCommand = (command) =>
  new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
      } else {
        resolve(stdout);
      }
    });
  });

const brokenPodsCheck = async (namespace) => {
  try {
    const podsOutput = await execCommand(
      `oc get pods -n ${namespace} --no-headers`
    );

    // Count broken pods (e.g., CrashLoopBackOff, Error, etc.)
    const brokenPods = podsOutput
      .split('\n')
      .filter((line) => line.includes('CrashLoopBackOff') || line.includes('Error')).length;

    return { brokenPods };
  } catch (error) {
    logger.error(`${namespace}: Error fetching pods`, error);
    return { brokenPods: -1 }; // Return -1 to indicate an error
  }
};

module.exports = brokenPodsCheck;