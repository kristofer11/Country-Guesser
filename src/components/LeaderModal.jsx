import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import useLeadersData from '../features/useLeadersData';

const LeaderModal = ({ finalStreak, handleNextCountry, setShowModal, setCountryNameDisplay }) => {
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

            const response = await axios.post('https://country-guesser-server.onrender.com/api/leaders', data);
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

                    <Form.Group controlId="formMessage" className='formGroup'>
                        <Form.Label>Message (optional)</Form.Label>
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
{/* NEED TO FIX LOGIC FOR 'NO THANKS' BUTTON */}
                    {/* <Button
                        onClick = {handleNextCountry}
                    >
                        No Thanks!</Button> */}
                </Form>
                :
                <div>
                    <h4>Sorry, that is incorrect! Better luck next time...</h4>
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