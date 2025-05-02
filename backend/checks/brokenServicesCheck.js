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

const brokenServicesCheck = async (namespace) => {
  logger.info(`Starting broken services check for namespace: ${namespace}`);

  try {
    const servicesOutput = await execCommand(
      `oc get services -n ${namespace} -o json`
    );
    const services = JSON.parse(servicesOutput).items;

    logger.info(`Found ${services.length} services in namespace: ${namespace}`);

    let brokenServicesCount = 0;

    for (const service of services) {
      const serviceName = service.metadata.name;

      // Skip Jaeger and Kafka services
      if (serviceName.includes('jaeger') || serviceName.includes('kafka')) {
        logger.info(`Skipping service: ${serviceName}`);
        continue;
     }

      const ports = service.spec.ports;
      const selector = service.spec.selector;

      logger.info(
        `${namespace}: Checking service: ${serviceName}, Ports: ${JSON.stringify(ports)}, Selector: ${JSON.stringify(selector)}`
      );

      // Convert the selector object into a label query string
      const labelSelector = Object.entries(selector || {})
        .map(([key, value]) => `${key}=${value}`)
        .join(',');

      if (!labelSelector) {
        logger.info(`${namespace}: Service ${serviceName} has no selector. Skipping.`);
        brokenServicesCount++;
        continue;
      }

      logger.info(`${namespace}: Using label selector: ${labelSelector}`);

      // Validate port mappings
      for (const port of ports) {
        const targetPort = port.targetPort;

        logger.info(
          `${namespace}: Validating port mapping for service: ${serviceName}, Target Port: ${targetPort}`
        );

        try {
          // Fetch pods associated with the service using the selector
          const podsOutput = await execCommand(
            `oc get pods -n ${namespace} -l ${labelSelector} -o json`
          );
          const pods = JSON.parse(podsOutput).items;

          if (pods.length === 0) {
            logger.info(`${namespace}: No pods found for service: ${serviceName}`);
            brokenServicesCount++;
            break; // No need to check further ports for this service
          }

          // Check if the targetPort exists in the pod's container ports
          let isTargetPortValid = false;

          for (const pod of pods) {
            const containerPorts = pod.spec.containers[0]?.ports || [];
            isTargetPortValid = containerPorts.some(
              (containerPort) => containerPort.containerPort === targetPort
            );

            if (isTargetPortValid) {
              logger.info(
                `${namespace}: Service ${serviceName} has a valid targetPort: ${targetPort}`
              );
              break; // If one pod has a valid targetPort, the service is valid
            }
          }

          if (!isTargetPortValid) {
            logger.info(
              `${namespace}: Service ${serviceName} has an invalid targetPort: ${targetPort}`
            );
            brokenServicesCount++;
            break; // No need to check further ports for this service
          }
        } catch (error) {
          logger.info(
            `${namespace}: Error validating targetPort for service ${serviceName}: ${error.message || error}`
          );
          brokenServicesCount++;
          break; // No need to check further ports for this service
        }
      }
    }

    logger.info(
      `${namespace}:  Total Services = ${services.length}, Broken Services = ${brokenServicesCount}`
    );

    return {
      brokenServices: brokenServicesCount,
    };
  } catch (error) {
    logger.error(`${namespace}: Error fetching services`, error);
    return {
      brokenServices: 0,
    }; // Return 0 for both counts in case of an error
  }
};

module.exports = brokenServicesCheck;