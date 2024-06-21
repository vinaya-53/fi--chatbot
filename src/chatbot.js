import React, { useState } from 'react';
import axios from 'axios';

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post('https://your-heroku-app.herokuapp.com/chat', {
        message: input,
      });
      const botMessage = { text: response.data.response, sender: 'bot' };
      setMessages([...messages, userMessage, botMessage]);
      setInput('');
    } catch (error) {
      console.error('Error sending message to the bot:', error);
    }
  };

  return (
    <div>
      <div style={{ border: '1px solid black', padding: '10px', height: '300px', overflowY: 'scroll' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default Chatbot;
