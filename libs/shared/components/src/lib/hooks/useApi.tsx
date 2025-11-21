import { useCallback, useState } from 'react';

export function useApi<T>(
  url: string,
  options?: RequestInit
): {
  data: T | null;
  loading: boolean;
  error: Error | string | null;
  refetch: () => Promise<void>;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | string | null>(null);

  const fetchData = useCallback(
    async (fetchOptions: RequestInit = {}) => {
      const controller = new AbortController();
      const signal = controller.signal;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          ...options,
          ...fetchOptions,
          signal,
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
        return result;
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    },
    [url, options]
  );

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
