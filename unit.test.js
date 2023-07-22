const chatbot = require('./src/controllers/newChatbotController');
const fetch = require('node-fetch');

jest.mock('node-fetch');

describe('Chatbot Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should set Get Started button', async () => {
    // Mock the response for the setGetStartedButton API call
    const mockResponse = { result: 'success' };
    const mockFetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
    });
    require('node-fetch').default = mockFetch;

    // Call the function
    await chatbot.setGetStartedButton();

    // Assertions
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('https://graph.facebook.com/'),
      expect.any(Object)
    );
  });

  it('should refresh ping successfully', async () => {
    // Mock the response for the refreshPing API call
    const mockResponse = { id: '12345' };
    const mockFetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
    });
    require('node-fetch').default = mockFetch;

    // Call the function
    await chatbot.refreshPing();

    // Assertions
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('https://graph.facebook.com/'),
      expect.any(Object)
    );
  });

  it('should fail to refresh ping and retry', async () => {
    // Mock the response for the refreshPing API call
    const mockError = { code: 'ETIMEDOUT', syscall: 'write' };
    const mockFetch = jest.fn().mockRejectedValueOnce(mockError).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({ id: '12345' }),
    });
    require('node-fetch').default = mockFetch;

    // Call the function
    await chatbot.refreshPing();

    // Assertions
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('https://graph.facebook.com/'),
      expect.any(Object)
    );
  });

  it('should set the persistent menu', async () => {
    // Mock the response for the callMessengerAPI function
    const mockResponse = { success: true };
    const mockCallMessengerAPI = jest.fn().mockResolvedValue(mockResponse);
    chatbot.callMessengerAPI = mockCallMessengerAPI;

    // Call the function
    chatbot.setPersistentMenu();

    // Assertions
    expect(mockCallMessengerAPI).toHaveBeenCalledTimes(1);
    expect(mockCallMessengerAPI).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should handle a valid postback payload', async () => {
    const sender_psid = '12345';
    const postback = {
      payload: 'about us',
    };

    // Mock the callSendAPI function
    const mockResponse = { success: true };
    const mockCallSendAPI = jest.fn().mockResolvedValue(mockResponse);
    chatbot.callSendAPI = mockCallSendAPI;

    // Call the handlePostBack function
    await chatbot.handlePostBack(sender_psid, postback);

    // Assertions
    expect(mockCallSendAPI).toHaveBeenCalledTimes(1);
    expect(mockCallSendAPI).toHaveBeenCalledWith(sender_psid, expect.any(Object));
  });

  it('should handle a valid message', async () => {
    const sender_psid = '12345';
    const message = {
      text: 'Hello',
    };

    // Mock the callSendAPI function
    const mockResponse = { success: true };
    const mockCallSendAPI = jest.fn().mockResolvedValue(mockResponse);
    chatbot.callSendAPI = mockCallSendAPI;

    // Call the handleMessage function
    await chatbot.handleMessage(sender_psid, message);

    // Assertions
    expect(mockCallSendAPI).toHaveBeenCalledTimes(1);
    expect(mockCallSendAPI).toHaveBeenCalledWith(sender_psid, expect.any(Object));
  });
});