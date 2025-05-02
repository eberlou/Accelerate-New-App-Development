const brokenPodsCheck = require('./checks/brokenPodsCheck');
const brokenServicesCheck = require('./checks/brokenServicesCheck');

const runHealthChecksForNamespace = async (namespace) => {
  const [podsResult, servicesResult] = await Promise.all([
    brokenPodsCheck(namespace),
    brokenServicesCheck(namespace),
  ]);

  return {
    namespace,
    ...podsResult,
    ...servicesResult,
  };
};

const runHealthChecks = async (namespaces) => {
  const results = await Promise.all(
    namespaces.map((namespace) => runHealthChecksForNamespace(namespace))
  );
  return results;
};

module.exports = runHealthChecks;