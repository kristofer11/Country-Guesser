import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:4000/api/scores';

const useLeadersData = () => {
  const [leadersData, setLeadersData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Failed to fetch scores');
        const data = await res.json();
        setLeadersData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { leadersData, error, loading };
};

export default useLeadersData;
