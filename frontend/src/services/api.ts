export async function getHealthChecks(): Promise<{ namespace: string; brokenPods: number }[]> {
    const response = await fetch('http://localhost:3001/api/healthchecks'); // Replace with your backend or local script endpoint
    if (!response.ok) {
      throw new Error('Failed to fetch healthchecks');
    }
    return response.json();
  }