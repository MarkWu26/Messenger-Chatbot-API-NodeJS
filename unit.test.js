const {
    setGetStartedButton,
    refreshPing,
    startPing,
    setPersistentMenu,
    homePage,
    getWebhook,
    postWebhook,
    sendWelcomeMessage,
    handlePostBack,
    handleMessage,
    fetchWithExponentialBackoff,
    callSendAPI
} = require('./src/controllers/newChatbotController');

jest.mock('node-fetch', () => require(jest - fetch - mock));
const fetch = require('node-fetch');

describe('Unit Test', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    //Test for setGetStartedButton
    it('setGetStartedButton should call API and log the result', async ()=> {
        fetch.mockResponseOnce(JSON.stringify({ success:true}), {status: 200});
        
        await setGetStartedButton();

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('https://'));
        expect(console.log).toHaveBeenCalledWith({success:true});
    });

})