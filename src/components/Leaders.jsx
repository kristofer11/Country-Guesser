import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useLeadersData from '../features/useLeadersData';

const Leaders = () => {
  const leadersData = useLeadersData();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get('https://secret-mountain-38731.herokuapp.com/api/leaders');
//         setLeadersData(response.data);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchData();
//   }, []);

  return (
    <div className='leaderBoard'>
    <h2 style={{marginTop: '4rem'}}>Leader Board</h2>
      
      {leadersData ? (
        <ul className='leaderList' style={{marginBottom: '4rem'}}>
          {leadersData.map((leader) => (
            <li key={leader.id}>{leader.name}: {leader.streak} <span style={{color: 'green'}}>||</span></li>
            
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Leaders;
