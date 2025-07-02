import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
// import leaderboardApiService from '../services/leaderboardApi';

const API_URL = 'http://localhost:4000/api/scores';

const LeaderModal = ({ finalStreak, handleNextCountry, setShowModal, setCountryNameDisplay }) => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                name: name,
                streak: finalStreak
            };
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to submit score');
        } catch (err) {
            setError('Failed to submit score. Please try again.');
            return;
        }
        // Reset the form
        setName('');
        setMessage('');
        handleNextCountry();
        setShowModal(false);
        setCountryNameDisplay('none');
    };

    const handleTryAgain = () => {
        // Just restart the game without submitting anything
        handleNextCountry();
        setShowModal(false);
        setCountryNameDisplay('none');
    };

    return (
        <div className='modalContainer'>
            {finalStreak ?
                <Form onSubmit={handleSubmit} className='leaderForm'>
                    <h2>Nice job, your streak was {finalStreak}!</h2>
                    <p>Enter your initials to be added to the leader board</p>
                    <Form.Group controlId="formName" className='formGroup'>
                        <Form.Label>Name </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={handleNameChange}
                            maxLength='10'
                            minLength={3}
                        />
                    </Form.Group>

                    {/* Message field is optional and not sent to backend */}

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                    {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}
                </Form>
                :
                <div>
                    <h4>Sorry, that is incorrect! Better luck next time...</h4>
                    <div className='leaderForm'>
                        <Button variant="primary" onClick={handleTryAgain}>
                            Try Again
                        </Button>
                    </div>
                </div>

            }
        </div>
    );
}

export default LeaderModal;