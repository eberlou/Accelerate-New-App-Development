import React, { useEffect, useState } from 'react';
import { getHealthChecks } from '../services/api';
import ProgressBar from './ProgressBar';

interface Namespace {
  healthPercentage: number;
  namespace: string;
  brokenPods: number;
  brokenServices: number;
}

const NamespaceList: React.FC = () => {
  const [namespaces, setNamespaces] = useState<Namespace[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await getHealthChecks();
      console.log('Fetched data:', data); // Log raw data from the backend

      // Map data to ensure `brokenServices` is always present and calculate health percentage
      const mappedData = data.map((ns: any) => ({
        namespace: ns.namespace,
        brokenPods: ns.brokenPods,
        brokenServices: ns.brokenServices ?? 0, // Default to 0 if missing
        healthPercentage: Math.max(
          0,
          100 - ns.brokenPods * 20 - ns.brokenServices * 10
        ), // Weighted calculation
      }));

      console.log('Mapped data:', mappedData); // Log processed data

      // Sort namespaces by health percentage (highest to lowest)
      const sortedData = mappedData.sort(
        (a, b) => b.healthPercentage - a.healthPercentage
      );

      setNamespaces(sortedData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval); // Clear interval on unmount
  }, []);

  if (error) {
    return <div className="text-red-600 font-bold">{error}</div>;
  }

  return (
    <div className="p-4 w-full">
      <div className="space-y-2">
        {namespaces.map((ns) => (
          <div key={ns.namespace} className="flex items-center space-x-4">
            {/* Badge for namespace */}
            <span
              className={`px-2 py-1 text-xs font-bold rounded-full ${
                ns.healthPercentage === 100
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {ns.namespace.split('-').pop()} {/* Extract 'userX' part */}
            </span>
            {/* Progress Bar */}
            <ProgressBar percentage={ns.healthPercentage} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NamespaceList;