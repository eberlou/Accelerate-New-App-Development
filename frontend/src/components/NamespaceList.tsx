import React, { useEffect, useState } from 'react';
import { getBrokenPods } from '../services/api';
import ProgressBar from './ProgressBar';

interface Namespace {
  namespace: string;
  brokenPods: number;
}

const NamespaceList: React.FC = () => {
  const [namespaces, setNamespaces] = useState<Namespace[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await getBrokenPods();
      setNamespaces(data.sort((a, b) => a.brokenPods - b.brokenPods));
    } catch (err) {
      setError('Failed to load data');
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return <div className="text-red-600 font-bold">{error}</div>;
  }

  return (
    <div className="p-4 w-full">
      <div className="space-y-2">
        {namespaces.map((ns, index) => {
          const healthPercentage = Math.max(0, 100 - ns.brokenPods * 10); // Example calculation
          const userPart = ns.namespace.split('-').pop(); // Extract 'userX' part
          return (
            <div key={ns.namespace} className="flex items-center space-x-4">
              {/* Badge for userX */}
              <span
                className={`px-2 py-1 text-xs font-bold rounded-full ${
                  healthPercentage === 100
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {userPart}
              </span>
              {/* Progress Bar */}
              <ProgressBar percentage={healthPercentage} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NamespaceList;