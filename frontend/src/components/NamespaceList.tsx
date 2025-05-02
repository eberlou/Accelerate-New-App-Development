import React, { useEffect, useState } from 'react';
import { getBrokenPods } from '../services/api';

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
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Broken Pods Standing</h1>
      <ul>
        {namespaces.map((ns) => (
          <li key={ns.namespace}>
            {ns.namespace}: {ns.brokenPods} broken pods
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NamespaceList;