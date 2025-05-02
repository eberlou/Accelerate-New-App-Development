export async function getBrokenPods(): Promise<{ namespace: string; brokenPods: number }[]> {
    const response = await fetch('http://localhost:3001/api/broken-pods'); // Replace with your backend or local script endpoint
    if (!response.ok) {
      throw new Error('Failed to fetch broken pods');
    }
    return response.json();
  }