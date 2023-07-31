const request = require('supertest');
const app = require('../src/server');
const chatbotController = require('../src/controllers/chatbotController');

jest.mock('../src/controllers/chatbotController', () => ({
  handleMessage: jest.fn((sender_psid, message) => {
    // Implement the handleMessage logic here if needed
  }),
  postWebhook: jest.fn(),
}));

describe('postWebhook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('testing the postwebhook to handle requests', async () => {
    // Mock the implementation of the postWebhook function to return a 200 response
    chatbotController.postWebhook.mockImplementationOnce((req, res) => {
      res.status(200).send('EVENT_RECEIVED');
    });

    // The requestBody object with appropriate data for the test
    const requestBody = {
      "object": "page",
      entry: [
        {
          messaging: [
            {
              sender: {
                id: "USER_SENDER_ID"
              },
              message: {
                text: "Hello, this is a test message"
              }
            }
          ]
        }
      ]
    };

    // Send the test request to the /webhook endpoint
    await request(app).post('/webhook').send(requestBody);

    // Assert that the postWebhook function was called
    expect(chatbotController.postWebhook).toHaveBeenCalled("USER_SENDER_ID", "Hello, this is a test message" );

    // Assert that the handleMessage function was called
    expect(chatbotController.handleMessage).toHaveBeenCalled();

    // Assert that the callSendAPI function was called from within handleMessage
    // You may need to mock the callSendAPI function as well and check its interactions
    expect(chatbotController.callSendAPI).toHaveBeenCalled();
  });
});
