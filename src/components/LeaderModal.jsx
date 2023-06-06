import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const LeaderModal = ({currentStreak}) => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
  
    const handleNameChange = (e) => {
      setName(e.target.value);
    };
  
    const handleMessageChange = (e) => {
      setMessage(e.target.value);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Do something with the form data (e.g., send it to a server)
      console.log('Name:', name);
      console.log('Message:', message);
      // Reset the form
      setName('');
      setMessage('');
    };

    return (
        <Form onSubmit={handleSubmit}>
            <h1>Nice job, your streak was {currentStreak}!</h1>
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