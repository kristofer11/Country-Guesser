import { useEffect, useState } from 'react';
import axios from 'axios';

const useLeadersData = () => {
  const [leadersData, setLeadersData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://country-guesser-server.onrender.com/api/leaders');
        setLeadersData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return leadersData;
};

export default useLeadersData;
