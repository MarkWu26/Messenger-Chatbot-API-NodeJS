const request = require('supertest');
const request = require('express');
const request = require('./src/controllers/newChatbotController');

const app = express;
app.get('/', newChatbotController.homePage);
app.get('/webhook', newChatbotController.getWebhook);
app.post('/webhook', newChatbotController.postWebhook);

process.env.YOUR_VERIFY_TOKEN = 'YOUR_VERIFY_TOKEN';

describe('Chatbot Controller API tests', () => {
  It('return welcome to messenger chatbot', async() => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Welcome to messenger chatbot');
  })

})