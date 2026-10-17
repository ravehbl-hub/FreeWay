// useFetch: loads data from the API and gives back { data, loading, error, reload }.
// Pages use it to show loading / error / empty states.
import { useEffect, useState } from 'react';

export function useFetch(loadFunction, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function reload() {
    setLoading(true);
    setError('');
    try {
      const result = await loadFunction();
      setData(result);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  // Load again whenever one of the dependencies changes (for example: the filters)
  useEffect(() => {
    reload();
  }, dependencies);

  return { data: data, loading: loading, error: error, reload: reload, setData: setData };
}
