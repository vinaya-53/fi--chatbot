import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
} else {
  console.error('Root element not found');
}
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

app.post('/chat', (req, res) => {
  const userMessage = req.body.message;
  let botResponse;

  if (userMessage.toLowerCase().includes('hello')) {
    botResponse = 'Hello! How can I help you today?';
  } else if (userMessage.toLowerCase().includes('stock price')) {
    botResponse = 'I can provide stock prices for various companies. Which company are you interested in?';
  } else if (userMessage.toLowerCase().includes('loan')) {
    botResponse = 'I can provide information about different types of loans. What type of loan are you interested in?';
  } else {
    botResponse = 'Sorry, I did not understand that. Can you please rephrase?';
  }

  res.send({ response: botResponse });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
