import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import useLeadersData from '../features/useLeadersData';

const LeaderModal = ({ finalStreak, handleNextCountry, setShowModal }) => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const leadersData = useLeadersData();

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
                message: message,
                streak: finalStreak
            };

            const response = await axios.post('https://secret-mountain-38731.herokuapp.com/api/leaders', data);
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error:', error);
        }
        console.log('Name:', name);
        console.log('Message:', message);
        console.log('Streak:', finalStreak);
        // Reset the form
        setName('');
        setMessage('');
        handleNextCountry();
        setShowModal(false);
    };

    return (
        <div className='modalContainer'>
            {finalStreak ?
                <Form onSubmit={handleSubmit} className='leaderForm'>
                    <h2>Nice job, your streak was {finalStreak}!</h2>
                    <p>Enter your initials and a brief message to be added to the leader board!</p>
                    <Form.Group controlId="formName">
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

                    <Form.Group controlId="formMessage">
                        <Form.Label>Message </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter your message"
                            value={message}
                            onChange={handleMessageChange}
                            maxLength='100'
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
                :
                <div>
                    <h4>Sorry, you couldn't even get one country right! Better luck next time...</h4>
                    <Form onSubmit={handleSubmit} className='leaderForm'>
                        <Button variant="primary" type="submit">
                            Try Again
                        </Button>
                    </Form>
                </div>

            }
        </div>
    );
}

export default LeaderModal;