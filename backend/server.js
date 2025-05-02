const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const runHealthChecks = require('./healthCheckManager');
const logger = require('./logger'); // Import the logger


const app = express();
const PORT = 3001;

app.use(cors());

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

// API endpoint to fetch health checks for namespaces
app.get('/api/healthchecks', async (req, res) => {
  try {
    // Get all namespaces matching the pattern
    const namespacesOutput = await execCommand(
      `oc get namespaces -o jsonpath='{.items[*].metadata.name}'`
    );
    const namespaces = namespacesOutput
      .split(' ')
      .filter((ns) => ns.startsWith('quarkus-superheroes-user'));

    // Run health checks for all namespaces
    const results = await runHealthChecks(namespaces);

    res.json(results);
    console.log('Health check result:', results);
  } catch (error) {
    logger.error('Error fetching health checks:', error);
    res.status(500).json({ error: 'Failed to fetch health checks' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});