require("dotenv").config()
const test = (req, res) => {
    return res.send("Welcome to messenger chatbot")
}



const getWebhook = (req, res) => {
    const YOUR_VERIFY_TOKEN = process.env.YOUR_VERIFY_TOKEN;
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === YOUR_VERIFY_TOKEN) {
            console.log("Webhook is verified yehey!")
            res.status(200).send(challenge)
        } 
    } else {
        res.sendStatus(403)
    }
}

const postWebhook = (req, res) => {
    const body = req.body;
    
    if (body.object === "page") {
        body.entry.forEach( function(entry) {
            const webhookEvent = entry.messaging[0];
            console.log(webhookEvent);
        
        const sender_psid = webhookEvent.sender.id;
        console.log(`sender Id: ${sender_psid}`)
        });
    } else {
        res.sendStatus(404)
    }

}

// Handles messages events
function handleMessage(sender_psid, received_message) {

}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  
}

module.exports = {
    test:test,
    getWebhook:getWebhook,
    postWebhook:postWebhook
};