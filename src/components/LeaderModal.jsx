import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const LeaderModal = ({finalStreak}) => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
  
    const handleNameChange = (e) => {
      setName(e.target.value);
    };
  
    const handleMessageChange = (e) => {
      setMessage(e.target.value);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      // Do something with the form data (e.g., send it to a server)
      
      try {
        const data = {
          name: name,
          message: message,
          streak: finalStreak
        };
  
        const response = await axios.put('https://secret-mountain-38731.herokuapp.com/api/leaders', data);
        console.log('Response:', response.data);
        // Handle the response as needed
      } catch (error) {
        console.error('Error:', error);
        // Handle the error as needed
      }
      console.log('Name:', name);
      console.log('Message:', message);
      console.log('Streak:', finalStreak);
      // Reset the form
      setName('');
      setMessage('');
    };

    return (
        <Form onSubmit={handleSubmit}>
            <h6>Nice job, your streak was {finalStreak}!</h6>
            <p>Enter your initials and a brief message to be added to the leader board!</p>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={handleNameChange}
              maxLength = '3'
            />
          </Form.Group>
    
          <Form.Group controlId="formMessage">
            <Form.Label>Message</Form.Label>
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
      );
}

export default LeaderModal;