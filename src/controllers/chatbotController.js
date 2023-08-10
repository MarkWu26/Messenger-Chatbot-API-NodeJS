require("dotenv").config();

import responses from "../responses/responses.json"
import keywords from "../keywords/keywords.json"


const setGetStartedButton = async()=>{
    try {
        const PAGE_ACCESS_TOKEN = process.env.VERIFY_ACCESS_TOKEN;
      const response = await fetch(`https://graph.facebook.com/v17.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          get_started: {
            payload: 'GET_STARTED_PAYLOAD', 
          },
        }),
      });
  
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Error setting Get Started button:', error);
    }
  }

setGetStartedButton();

const refreshPing = async () =>{ //refresh the ping of server to keep it awake
        console.log("refreshing ping")
        try{
           
            console.log("trying to refresh ping")
            const APP_ID = process.env.APP_ID;
            const VERIFY_ACCESS_TOKEN = process.env.VERIFY_ACCESS_TOKEN
            const response = await fetch(`https://graph.facebook.com/${APP_ID}?fields=id&access_token=${VERIFY_ACCESS_TOKEN}`);
            const data = await response.json();
    
           if(data.id === APP_ID){
            console.log('Ping Refresh successful. Chatbot is active');
           }
           else{
            console.log('Ping refresh failed. Chatbot might be inactive or there is an issue');
           }
        }
       catch(err){
        console.error("Error during ping check", err);
        if(err.code === 'ETIMEDOUT' && err.syscall === 'write'){
            console.log("retrying ping refresh...")
            await new Promise ((resolve)=> setTimeout(resolve, 1000));
            return refreshPing();
        }
       }
}

    
const startPing = () =>{
    console.log("Starting ping...");
    refreshPing();
    console.log("setting timeout 1");
    setInterval(refreshPing, 1 * 60 * 1000);
    console.log("setting timeout 2");
}

startPing(); 

let isPersistentMenuSet = false;

 const callMessengerAPI = async (request_body) => {
    console.log("Calling Messenger API")
    try {
      const VERIFY_ACCESS_TOKEN = process.env.VERIFY_ACCESS_TOKEN
      const response = await fetch(`https://graph.facebook.com/v17.0/me/messenger_profile?access_token=${VERIFY_ACCESS_TOKEN}`, {
        method: "POST",
        body: JSON.stringify(request_body),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log("Success! The response is:", data);
    } catch (error) {
      console.error("Error calling API", error);
    }
  };

const setPersistentMenu = () =>{
    const request_body = {
    "persistent_menu": [
           { 
            "locale": "default",
            "call_to_actions": [
                {
                    "type": "postback",
                    "title": "About Us",
                    "payload": "about us"
                },
                {
                    "type": "postback",
                    "title": "Our Services",
                    "payload": "services"
                },
                {
                    "type": "postback",
                    "title": "Policies and Accomplishments",
                    "payload": "policies and projects"
                }
            ]
            }
        ]
    }
    console.log("Setting Persistent Menu")

    callMessengerAPI(request_body);
}

setPersistentMenu(); 
 
const homePage = (req, res) => {
    return res.send("Welcome to messenger chatbot")
}

const getWebhook = (req, res) => {

        const YOUR_VERIFY_TOKEN = process.env.YOUR_VERIFY_TOKEN;
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge']; // "CHALLENGE_ACCEPTED"
    
        if (mode && token) {
            if (mode === 'subscribe' && token === YOUR_VERIFY_TOKEN) {
                console.log("Webhook is verified yehey!")
                res.status(200).send(challenge)
            } 
            else {
                res.sendStatus(403).send("incorrect Verify Token")
            }
        } 
        else{
            res.sendStatus(403).send("Missing mode and token")
        }
}
  

const postWebhook = async (req, res) => {

    try{
        const body = req.body;
        if (body.object === "page") {
        const messagePromises = body.entry.map(async(entry) =>{
            const webhookEvent = entry.messaging[0];
            console.log(webhookEvent);
        
            const sender_psid = webhookEvent.sender.id;
            console.log(`sender Id: ${sender_psid}`);

            if(webhookEvent.message){
                await handleMessage(sender_psid, webhookEvent.message);
            } else if(webhookEvent.postback){
                await handlePostBack(sender_psid, webhookEvent.postback);
            }
        });
               await Promise.all(messagePromises);
            // Call setPersistentMenu initially
          if (isPersistentMenuSet === false) {
            setPersistentMenu();
            isPersistentMenuSet = true;
          }
            res.status(200).send('EVENT RECEIVED');
        } 
        else {
            res.status(200).send('test sucess');
            console.log("test is working")
        } 
    }
    catch (err){
        console.error(err)
        res.sendStatus(404);
    }
  
}

const handlePostBack = async (sender_psid, received_postback) => {
    const payload = received_postback.payload
    let response;
    try{
        switch(payload){
            case "about us": 
            response = responses.aboutUs;
            break;
    
            case "nature of business":
                response = responses.natureOfBusiness;
            break;
    
            case "vision and mission":
                response = responses.visionAndMission;
                break;
    
            case "history":
                response = responses.history;
            break;
    
            case "services":  //main category services
            response = responses.services;
            break;
    
            case "our services":
            response = responses.ourServices;
            break;
    
            case "online payment":
                response = responses.onlinePayment;
            break;
    
            case "partnered companies":
                response = responses.partneredCompanies
            break;
            
            case "policies and projects":  //main category for policies and projects
            response = responses.policiesAndProjects;
            break;
    
            case "policy":
                response = responses.policy;
            break;
    
            case "accomplished projects":
                response = responses.accomplishedProjects;
            break;

            case "GET_STARTED_PAYLOAD":
                response = responses.introductory;
            break;
    
            default:
                response = responses.introductory;
            break;
        }
        await callSendAPI(sender_psid, response);
    }
    catch(err){
        console.error(err);
        res.sendStatus(404);
    }
}

const handleMessage = async (sender_psid, received_message) => {
    let response;

    try{
        if (received_message.text){
            const Message = received_message.text.toLowerCase();
    
            const regex = /\d{11}/; // regex to find trailing 11 digits, it means they sent a mobile phone number
            const regexplus = /\+\d{12}/; // check if there is a "+" trailed with 12 digits numbers ex.(+639162.....)

            const checkKeyWord = (keywords) =>{
                return keywords.some(keyword =>  Message.includes(keyword))
            }
            //check if user has sent a mobile phone number
            if(regex.test(Message) || regexplus.test(Message)){
                response = {
                    "text": "This is noted.\n\nWe will now forward your information to our Technical Representative.\n\nThank you so much!"
                }
            }
            //how much keywords
            else if(checkKeyWord(keywords.howMuchKeyword)){
                response = {
                    "text": "To better assist you with your inquiry about our pricing, we kindly request your mobile number.\n\nOne of our friendly personnel will reach out to you shortly to provide all the details you need. Your contact information will be treated with utmost confidentiality.\n\nThank you for choosing GSYNC Solutions!"
                }
            }
            //about keywords
            else if(checkKeyWord(keywords.aboutKeyword)){
                response = responses.aboutUs;
            }
            //services keywords
            else if(checkKeyWord(keywords.serviceKeyword)){
                response = responses.services;
            }
            //policy and projects
            else if(checkKeyWord(keywords.policyProjKeywords)){
                response = responses.policiesAndProjects
            }
            //thank you keywords
            else if(checkKeyWord(keywords.thankyouKeyword)){
                response = {"text": "You're welcome! If you have any more questions or need further assistance, feel free to ask."}
            }
            //affirmative keywrods
            else if(checkKeyWord(keywords.affirmativeKeyword)){
                response = {
                    "text": "Alright! If you have any more questions or need further assistance, feel free to ask."
                }
            }
            // job
            else if(checkKeyWord(keywords.jobKeyword)){
                response = {
                    "text": "We are sorry, but we are only currently looking for student internships."
                }
            } 
            //hiring interns
            else if(checkKeyWord(keywords.hiringKeyword)){
                response = {
                    "text": "Yes. We are currently accepting student interns.\n\nWe only offer Work from Home Virtual Internships.\n\nPlease send your detailed CV and other related internship documents to hr@gsync.solutions or yourfriends@gsync.solutions.\n\nThank you for your interest in choosing our company!"
                }
            } 
            // work from home keywords
            else if (checkKeyWord(keywords.wfhKeyword)){
                response = {
                    "text": "Yes, we only provide virtual internships/work-from-home setup.\nIf you are interested, you may send your resume/CV to hr@gsync.solutions or gsyncrecruiter@gmail.com"
                }
            }
            // supervisor keywords
            else if(checkKeyWord(keywords.supervisorKeyword)){
                response ={
                    "text": "Here are the contact details of the Operations Supervisor:\n\nMr. Rogerio G. Espiritu\nOperations Supervisor, GSYNC Solutions Philippines\n0969 315 3363\njettespiritu@gsync.solutions"
                }
            } // greeting keywords
            else if (checkKeyWord(keywords.greetingKeyword)){
                response = {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "generic",
                            "elements": [
                                        {"title": "Welcome to GSYNC Solutions Philippines!\n\nIf you have any other questions or need immediate support, please feel free to contact us:\n\nContact Numbers: \n+63 917 148 5103\n+63 917 544 9777\n+63 977 692 5903\n\nLandline Numbers:\n+63 54 8810167\n+63 46 2310601\n\nEmail Address:\nyourfriends@GSYNC.solutions\nGSYNC.solutions.ph@outlook.com\n\nFor further assistance, please select one of the options below: \n",
                                        "image_url": "https://i.ibb.co/zb05Ccv/welcome-to-gsync.png", //only good for six months free hosting only
                                        "buttons" : [
                                                        {
                                                            "type": "postback",
                                                            "title": "About Us",
                                                            "payload": "about us"
                                                        },
                                                        {
                                                            "type": "postback",
                                                            "title": "Services",
                                                            "payload": "services"
                                                        },
                                                        {
                                                            "type": "postback",
                                                            "title": "Policies and Projects",
                                                            "payload": "policies and projects"
                                                        }
                                                     ]
                            
                                        }
                                        ]
                        }
                    }
                }
            }
            //location keywords
            else if (checkKeyWord(keywords.locationKeyword)){
                response = {
                    "text": "GSYNC Solutions Philippines is located at:\n\n8 Santol St, Liboton\n\nNaga City, Philippines 4400\n\nYou may also contact us at:\n09171485103\nyourfriends@gsync.solutions"
                }
            }
            // contact keywords
            else if(checkKeyWord(keywords.contactKeyword)){
                response = {
                    "text": "You May contact us at:\n\nContact Numbers: \n+63 917 148 5103\n+63 917 544 9777\n+63 977 692 5903\n\nLandline Numbers:\n+63 54 8810167\n+63 46 2310601\n\nEmail Address:\nyourfriends@GSYNC.solutions\nGSYNC.solutions.ph@outlook.com\n\nGSYNC Solutions Philippines is located at:\n\n8 Santol St, Liboton\n\nNaga City, Philippines 4400"
                }
            }
            else if(checkKeyWord(keywords.concernKeyword)){
                response = {
                    "text": "To better assist you with your concerns, we kindly request your mobile number.\n\nOne of our friendly personnel will reach out to you shortly to provide all the details you need. Your contact information will be treated with utmost confidentiality."
                }
            }
            else{
                response={
                    "text": "Sorry, we could not understand your inquiry."
                }
            }
        } 
        await callSendAPI(sender_psid, response);
    }
    catch(err){
        console.error("Could not handle postmessage request due to:", err);
        res.sendStatus(404);
    }
      
}



const fetchWithExponentialBackoff = async (url, options, maxRetries =3) =>{
    let retries = 0;
    let delay = 1000;

    while(retries < maxRetries){
        try{
            const response = await fetch(url, options);
            return response;
        }
        catch (err){
            if(err.type === 'request-timeout' || err.code === 'UND_ERR_CONNECT_TIMEOUT'){
                retries++;
                await new Promise ((resolve) => setTimeout(resolve, delay));
                delay *= 2;
            }
            else {
                throw err;
            }
        }
    }

    throw new Error ('Exceeded maximum retries for API Call');
}

// Sends response messages via the Send API
 const callSendAPI = async (sender_psid, response) => {
    console.log("trying to send message!")

  let request_body ={
    "recipient": {
        "id": sender_psid
    },
    "message": response
  }
  const VERIFY_ACCESS_TOKEN = process.env.VERIFY_ACCESS_TOKEN;

  try{
    const response = await fetchWithExponentialBackoff(`https://graph.facebook.com/v17.0/me/messages?access_token=${VERIFY_ACCESS_TOKEN}`, { 
        "method": "POST",
        body: JSON.stringify(request_body),
        headers: {'Content-Type': 'application/json'}
    }, 3);
    const result = await response.json();
    console.log(result);
  } catch (err){
    console.error('Error sending message:', err)
  }
} 


module.exports = {
    homePage:homePage,
    getWebhook:getWebhook,
    postWebhook:postWebhook,
    handleMessage:handleMessage
};