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
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return <div className="text-red-600 font-bold">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-red-hat-primary mb-4">
        Broken Pods Standing
      </h1>
      <ul className="space-y-4">
        {namespaces.map((ns) => {
          const healthPercentage = Math.max(0, 100 - ns.brokenPods * 10); // Example calculation
          return (
            <li
              key={ns.namespace}
              className="p-4 bg-white shadow rounded-lg border border-gray-200"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg">{ns.namespace}</span>
                <span className="text-sm text-gray-500">
                  {healthPercentage}% Healthy
                </span>
              </div>
              <ProgressBar percentage={healthPercentage} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default NamespaceList;