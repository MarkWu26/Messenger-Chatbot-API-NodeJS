// Import the functions to be tested
const {
    handleMessage,
    handlePostBack,
    callSendAPI,
    fetchWithExponentialBackoff,
  } = require('./your_file_name_containing_functions.js'); // Replace 'your_file_name_containing_functions.js' with the actual filename
  
  // Mock the fetch function to avoid actual API calls during testing
  jest.mock('node-fetch');
  
  // Mock the setTimeout function to avoid actual waiting during testing
  jest.useFakeTimers();
  
  // Test handleMessage function
  describe('handleMessage function', () => {
    test('should handle message with valid keywords', () => {
      const sender_psid = 'PSID123';
      const message = { text: 'about us' };
      const expectedResponse = {
        text: 'Response for about us',
      };
      const callSendAPI = jest.fn();
      handleMessage(sender_psid, message, callSendAPI);
      expect(callSendAPI).toHaveBeenCalledWith(sender_psid, expectedResponse);
    });
  
    test('should handle message with invalid keywords', () => {
      const sender_psid = 'PSID123';
      const message = { text: 'invalid keyword' };
      const expectedResponse = {
        text: 'Sorry, we could not understand your inquiry.',
      };
      const callSendAPI = jest.fn();
      handleMessage(sender_psid, message, callSendAPI);
      expect(callSendAPI).toHaveBeenCalledWith(sender_psid, expectedResponse);
    });
  });
  
  // Test handlePostBack function
  describe('handlePostBack function', () => {
    test('should handle postback with valid payload', () => {
      const sender_psid = 'PSID123';
      const postback = { payload: 'about us' };
      const expectedResponse = {
        text: 'Response for about us',
      };
      const callSendAPI = jest.fn();
      handlePostBack(sender_psid, postback, callSendAPI);
      expect(callSendAPI).toHaveBeenCalledWith(sender_psid, expectedResponse);
    });
  
    test('should handle postback with invalid payload', () => {
      const sender_psid = 'PSID123';
      const postback = { payload: 'invalid payload' };
      const expectedResponse = {
        text: 'Sorry, we could not understand your inquiry.',
      };
      const callSendAPI = jest.fn();
      handlePostBack(sender_psid, postback, callSendAPI);
      expect(callSendAPI).toHaveBeenCalledWith(sender_psid, expectedResponse);
    });
  });
  
  // Test callSendAPI function
  describe('callSendAPI function', () => {
    test('should call the Send API with correct parameters', async () => {
      const sender_psid = 'PSID123';
      const response = { text: 'This is a test response' };
      const VERIFY_ACCESS_TOKEN = 'YOUR_VERIFY_ACCESS_TOKEN'; // Replace with the actual access token
      require('node-fetch').mockResolvedValueOnce({ json: () => Promise.resolve({}) });
  
      // Call the actual function
      await callSendAPI(sender_psid, response, VERIFY_ACCESS_TOKEN);
  
      // Add your assertions here to check if the Send API was called correctly
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://graph.facebook.com/v17.0/me/messages?access_token='),
        {
          method: 'POST',
          body: JSON.stringify({
            recipient: {
              id: sender_psid,
            },
            message: response,
          }),
          headers: { 'Content-Type': 'application/json' },
        }
      );
    });
  });
  
  // Test fetchWithExponentialBackoff function
  describe('fetchWithExponentialBackoff function', () => {
    test('should retry fetch with exponential backoff on timeout', async () => {
      require('node-fetch').mockRejectedValueOnce({ type: 'request-timeout', code: 'UND_ERR_CONNECT_TIMEOUT' });
  
      // Call the actual function with maxRetries = 3 and a delay of 1000 ms
      const promise = fetchWithExponentialBackoff('http://example.com', {}, 3);
      jest.advanceTimersByTime(1000); // Advance the timer by 1000 ms
  
      // Expect a delay of 2000 ms and then another fetch attempt
      await expect(promise).resolves.toEqual({}); // Mocked empty response
  
      jest.advanceTimersByTime(2000); // Advance the timer by 2000 ms (total 3000 ms)
  
      // Expect another fetch attempt
      await expect(promise).resolves.toEqual({}); // Mocked empty response
  
      jest.advanceTimersByTime(4000); // Advance the timer by 4000 ms (total 7000 ms)
  
      // Expect the final fetch attempt
      await expect(promise).resolves.toEqual({}); // Mocked empty response
  
      // After maxRetries, expect a rejection
      await expect(promise).rejects.toThrow('Exceeded maximum retries for API Call');
    });
  
    test('should reject immediately on non-timeout errors', async () => {
      require('node-fetch').mockRejectedValueOnce(new Error('Some other error'));
  
      // Call the actual function with maxRetries = 3 and a delay of 1000 ms
      const promise = fetchWithExponentialBackoff('http://example.com', {}, 3);
  
      // Expect an immediate rejection
      await expect(promise).rejects.toThrow('Some other error');
    });
  
    test('should resolve immediately on successful fetch', async () => {
      require('node-fetch').mockResolvedValueOnce({ json: () => Promise.resolve({}) });
  
      // Call the actual function with maxRetries = 3 and a delay of 1000 ms
      const promise = fetchWithExponentialBackoff('http://example.com', {}, 3);
  
      // Expect an immediate resolution
      await expect(promise).resolves.toEqual({}); // Mocked empty response
    });
  });  