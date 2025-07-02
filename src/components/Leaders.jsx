import { useState } from 'react';
import useLeadersData from '../features/useLeadersData';

const PAGE_SIZE = 5;

const Leaders = () => {
    const { leadersData, error, loading } = useLeadersData();
    const [page, setPage] = useState(1);

    const sortedLeadersData = leadersData
        ? [...leadersData].sort((a, b) => b.streak - a.streak) : [];

    const totalPages = Math.ceil(sortedLeadersData.length / PAGE_SIZE);
    const pagedLeaders = sortedLeadersData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handlePrev = () => setPage((p) => Math.max(1, p - 1));
    const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

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
        <div className='leaderBoard' style={{ 
            marginTop: '4rem', 
            padding: '2rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            maxWidth: '600px',
            margin: '4rem auto 2rem auto'
        }}>
            <h2 style={{ 
                textAlign: 'center', 
                marginBottom: '2rem',
                color: '#333',
                fontSize: '2rem',
                fontWeight: 'bold'
            }}>
                🏆 Leaderboard
            </h2>

            {loading && (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p style={{ marginTop: '1rem', color: '#666' }}>Loading leaderboard...</p>
                </div>
            )}
            
            {error && (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '1rem',
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    borderRadius: '5px',
                    marginBottom: '1rem'
                }}>
                    Error loading leaderboard: {error}
                </div>
            )}

            {!loading && !error && pagedLeaders.length > 0 && (
                <div>
                    <div style={{ 
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr auto 1fr',
                        gap: '1rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#e9ecef',
                        borderRadius: '5px',
                        marginBottom: '1rem',
                        fontWeight: 'bold',
                        color: '#495057'
                    }}>
                        <span>#</span>
                        <span>Player</span>
                        <span>Streak</span>
                        <span>Date</span>
                    </div>
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {pagedLeaders.map((leader, index) => (
                            <div key={leader._id || leader.id} style={{
                                display: 'grid',
                                gridTemplateColumns: 'auto 1fr auto 1fr',
                                gap: '1rem',
                                padding: '0.75rem 1rem',
                                borderBottom: '1px solid #dee2e6',
                                backgroundColor: 'white',
                                borderRadius: 0,
                                fontWeight: 'normal'
                            }}>
                                <span style={{ color: '#6c757d', fontWeight: 'bold' }}>
                                    {(page - 1) * PAGE_SIZE + index + 1}
                                </span>
                                <span style={{ color: '#495057' }}>
                                    {leader.name}
                                </span>
                                <span style={{ color: '#28a745', fontWeight: 'bold' }}>
                                    {leader.streak}
                                </span>
                                <span style={{ color: '#6c757d' }}>
                                    {formatDate(leader.created_at)}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem', gap: '1rem' }}>
                        <button onClick={handlePrev} disabled={page === 1} style={{ padding: '0.5rem 1rem', borderRadius: '5px', border: 'none', background: page === 1 ? '#e9ecef' : '#007bff', color: page === 1 ? '#adb5bd' : 'white', cursor: page === 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>Prev</button>
                        <span style={{ color: '#495057', fontWeight: '500' }}>Page {page} of {totalPages}</span>
                        <button onClick={handleNext} disabled={page === totalPages} style={{ padding: '0.5rem 1rem', borderRadius: '5px', border: 'none', background: page === totalPages ? '#e9ecef' : '#007bff', color: page === totalPages ? '#adb5bd' : 'white', cursor: page === totalPages ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>Next</button>
                    </div>
                </div>
            )}

            {!loading && !error && sortedLeadersData.length === 0 && (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '3rem 2rem',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    border: '2px dashed #dee2e6'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
                    <h3 style={{ color: '#495057', marginBottom: '1rem' }}>
                        No scores yet!
                    </h3>
                    <p style={{ color: '#6c757d', fontSize: '1rem', marginBottom: '0.5rem' }}>
                        Play the game to see your scores here.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Leaders;
