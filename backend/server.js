const express = require('express');
const { exec } = require('child_process');

const app = express();
const PORT = 3001;

const cors = require('cors');
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

// API endpoint to fetch broken pod data
app.get('/api/broken-pods', async (req, res) => {
  try {
    // Get all namespaces matching the pattern
    const namespacesOutput = await execCommand(
      `oc get namespaces -o jsonpath='{.items[*].metadata.name}'`
    );
    const namespaces = namespacesOutput
      .split(' ')
      .filter((ns) => ns.startsWith('quarkus-superheroes-user'));

    const results = [];

    // Fetch pod statuses for each namespace
    for (const namespace of namespaces) {
      const podsOutput = await execCommand(
        `oc get pods -n ${namespace} --no-headers`
      );

      // Count broken pods (e.g., CrashLoopBackOff, Error, etc.)
      const brokenPods = podsOutput
        .split('\n')
        .filter((line) => line.includes('CrashLoopBackOff') || line.includes('Error')).length;

      results.push({ namespace, brokenPods });
    }

    // Sort results by least to most broken pods
    results.sort((a, b) => a.brokenPods - b.brokenPods);

    res.json(results);
  } catch (error) {
    console.error('Error fetching broken pods:', error);
    res.status(500).json({ error: 'Failed to fetch broken pods' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});