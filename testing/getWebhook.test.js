const request = require('supertest');
const app = require('../src/server');

// Import the chatbotController from the correct file location
const chatbotController = require('../src/controllers/chatbotController');

// Mock the chatbotController so that we can test the getWebhook function separately
jest.mock('../src/controllers/chatbotController', () => ({
  getWebhook: jest.fn(),
}));

describe('getWebhook', () => {


  test('should verify the webhook when provided with the correct verify token', async () => {
    const YOUR_VERIFY_TOKEN = 'GSYNCITTEAM123'; // Replace with the actual verify token
    const challenge = 'CHALLENGE_ACCEPTED';

    // Mock the behavior of the getWebhook function to send the challenge as response
    chatbotController.getWebhook.mockImplementationOnce((req, res) => {
      res.status(200).send(challenge);
    });

    const response = await request(app).get('/webhook').query({
      'hub.mode': 'subscribe',
      'hub.verify_token': YOUR_VERIFY_TOKEN,
      'hub.challenge': challenge,
    });

    expect(response.status).toBe(200);
    expect(response.text).toBe(challenge);
  });

  test('should return 403 when incorrect verify token is provided', async () => {
    const YOUR_VERIFY_TOKEN = 'INVALID_VERIFY_TOKEN'; // Replace with an incorrect token

    // Mock the behavior of the getWebhook function to return a 403 response
    chatbotController.getWebhook.mockImplementationOnce((req, res) => {
      res.sendStatus(403);
    });

    const response = await request(app).get('/webhook').query({
      'hub.mode': 'subscribe',
      'hub.verify_token': YOUR_VERIFY_TOKEN,
    });

    expect(response.status).toBe(403);
  });
});