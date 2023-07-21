require("dotenv").config();

import aboutUs from "../responses/aboutUs.json"
import natureOfBusiness from "../responses/natureOfBusiness.json"
import policiesAndProjects from "../responses/policiesAndProjects.json"
import visionAndMission from "../responses/visionAndMission.json"
import ourServices from "../responses/ourServices.json"
import onlinePayment from "../responses/onlinePayment.json"
import partneredCompanies from "../responses/partneredCompanies.json"
import policy from "../responses/policy.json"
import services from "../responses/services.json"
import accomplishedProjects from "../responses/accomplishedProjects.json"
import history from "../responses/history.json"

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

const refreshPing = async () =>{
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
        body.entry.forEach(function(entry) {
            const webhookEvent = entry.messaging[0];
            console.log(webhookEvent);
        
        const sender_psid = webhookEvent.sender.id;
        console.log(`sender Id: ${sender_psid}`);

        if(webhookEvent.message){
            handleMessage(sender_psid, webhookEvent.message);
         }
         else if(webhookEvent.postback){
            handlePostBack(sender_psid, webhookEvent.postback);
         }
    });

        // Call setPersistentMenu initially
      if (isPersistentMenuSet === false) {
        setPersistentMenu();
        isPersistentMenuSet = true;
      }

        res.status(200).send('EVENT RECEIVED');

    } else {
        res.sendStatus(404)
    }
}

const sendWelcomeMessage = (sender_psid) =>{
    const response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "Welcome to GSYNC Solutions Philippines!\n\nIf you have any other questions or need immediate support, please feel free to contact us:\n\nContact Numbers: \n+63 917 148 5103\n+63 917 544 9777\n+63 977 692 5903\n\nLandline Numbers:\n+63 54 8810167\n+63 46 2310601\n\nEmail Address:\nyourfriends@GSYNC.solutions\nGSYNC.solutions.ph@outlook.com\n\nFor further assistance, please select one of the options below: \n",
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
        }
    }
    callSendAPI(sender_psid, response)
}

const handlePostBack = (sender_psid, received_postback) => {
    const payload = received_postback.payload

    let response;

    switch(payload){
        case "about us": 
        response = aboutUs;
        break;

        case "nature of business":
            response = natureOfBusiness;
        break;

        case "vision and mission":
            response = visionAndMission;
            break;

        case "history":
            response = history;
        break;

        //main category services
        case "services": 
        response = services;

        break;

        case "our services":
        response = ourServices;
        break;

        case "online payment":
            response = onlinePayment;
        break;

        case "partnered companies":
            response = partneredCompanies
        break;
        
        //main category for policies and projects
        case "policies and projects":
        response = policiesAndProjects;
        break;

        case "policy":
            response = policy;
        break;

        case "accomplished projects":
            response = accomplishedProjects;
        break;

        default:
            response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": "Welcome to GSYNC Solutions Philippines!\n\nIf you have any other questions or need immediate support, please feel free to contact us:\n\nContact Numbers: \n+63 917 148 5103\n+63 917 544 9777\n+63 977 692 5903\n\nLandline Numbers:\n+63 54 8810167\n+63 46 2310601\n\nEmail Address:\nyourfriends@GSYNC.solutions\nGSYNC.solutions.ph@outlook.com\n\nFor further assistance, please select one of the options below: \n",
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
                }
            }
        break;
    }
    callSendAPI(sender_psid, response)
}

const handleMessage = (sender_psid, received_message) => {
    let response;

      if (received_message.text){
        const Message = received_message.text.toLowerCase();

        //About Keyword
        const aboutKeyword = ["about"];
        const isKeywordAbout = aboutKeyword.some(keyword=> Message.includes(keyword));

        //Service Keyword
        const serviceKeyword = ["service", "services"];
        const isKeywordService = serviceKeyword.some(keyword => Message.includes(keyword));

        //policies and projects keyword
        const policyProjKeywords = ["policies", "projects", "project"];
        const isKeywordpolicyproj = policyProjKeywords.some(keyword => Message.includes(keyword));

        //thank you keywords
        const thankyouKeyword = ["thank you", "thank", "thankyou", "thanks", "salamat", "tenx", "thanz", "thankz", "tenks", "thank you so much"]; //ty
        const isKeyWordthankyou = thankyouKeyword.some(keyword => Message.includes(keyword));

        //hiring keywords
        const hiringKeyword = ["ojt", "accepting", "hiring", "looking", 
        "available", "hire", "opening", "open", "accept", "apply", "applying", "tanggap", "tumatanggap"];
        const isKeywordhiring = hiringKeyword.some(keyword => Message.includes(keyword));

        //how much keywords
        const howMuchKeyword = ["how much", "price", "magkano"]; //hm
        const isHowMuch = howMuchKeyword.some(keyword => Message.includes(keyword));

        //job keywords
        const jobKeyword = ["job", "jobs", "job opportunities", "seeking for job", "looking for job", "seeking for a job", "looking for a job", "full-time", "part-time", "full time", "part time"];
        const iskeywordJob = jobKeyword.some(keyword => Message.includes(keyword));

        //wfh keywords
        const wfhKeyword = ["virtual", "wfh", "work from home", "work-from-home", "online"];
        const isKeywordWfh = wfhKeyword.some(keyword => Message.includes(keyword));

        //supervisor
        const supervisorKeyword = ["supervisor", "executive", "executives"];
        const isKeywordSupervisor = supervisorKeyword.some(keyword => Message.includes(keyword));

        //
        const greetingKeyword = ["hi", "hello", "wassup", "good day", "good afternoon", "good morning", "kumusta", "goodafternoon", "goodmorning", "goodday", "hey", "a pleasant day", "hola", "morning", "good evening", "greetings"]
        const isKeywordGreeting = greetingKeyword.some(keyword => Message.includes(keyword));

        const affirmativeKeyword = ["okay", "noted", "ok", "alright", "roger", "copy", "roger that", "copy that", "oki", "okie", "sige"];
        const isKeywordAffirmative = affirmativeKeyword.some(keyword => Message.includes(keyword));

        const locationKeyword = ["located", "locations", "location", "locate", "locating", "situated"];
        const iskeywordlocation = locationKeyword.some(keyword => Message.includes(keyword));

        const contactKeyword = ["contact", "email", "address"];
        const iskeywordContact = contactKeyword.some(keyword => Message.includes(keyword));

        const regex = /\d{11}/;
        const regexplus = /\+\d{12}/;

        if(regex.test(Message) || regexplus.test(Message)){
            response = {
                "text": "This is noted.\n\nWe will now forward your information to our Technical Representative.\n\nThank you so much!"
            }
        }
        else if(isHowMuch){
            response = {
                "text": "Thank you for your interest in our services!\n\nTo better assist you with your inquiry about our pricing, we kindly request your mobile number.\n\nOne of our friendly personnel will reach out to you shortly to provide all the details you need. Your contact information will be treated with utmost confidentiality.\n\nThank you for choosing GSYNC Solutions!"
            }
        }
        else if(isKeywordAbout){
            response = aboutUs;
        }
        else if(isKeywordService){
            response = services;
        }
        else if(isKeywordpolicyproj){
            response = policiesAndProjects
        }
        else if(isKeyWordthankyou){
            response = {"text": "You're welcome! If you have any more questions or need further assistance, feel free to ask."}
        }
        else if(isKeywordAffirmative){
            response = {
                "text": "Alright! If you have any more questions or need further assistance, feel free to ask."
            }
        }
        else if(iskeywordJob){
            response = {
                "text": "We are sorry, but we are only currently looking for student internships."
            }
        }
        else if(isKeywordhiring){
            response = {
                "text": "Yes. We are currently accepting student interns.\n\nWe only offer Work from Home Virtual Internships.\n\nPlease send your detailed CV and other related internship documents to hr@gsync.solutions or yourfriends@gsync.solutions.\n\nThank you for your interest in choosing our company!"
            }
        }
        else if (isKeywordWfh){
            response = {
                "text": "Yes, we only provide virtual internships/work-from-home setup.\nIf you are interested, you may send your resume/CV to hr@gsync.solutions or gsyncrecruiter@gmail.com"
            }
        }
        else if(isKeywordSupervisor){
            response ={
                "text": "Here are the contact details of the Operations Supervisor:\n\nMs. Lara G. Zafranco\nOperations Supervisor, GSYNC Solutions Philippines\n0969 315 3363\nlgzafranco.gsync@gmail.com"
            }
        }
        else if (isKeywordGreeting){
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
        else if (iskeywordlocation){
            response = {
                "text": "GSYNC Solutions Philippines is located at:\n\n8 Santol St, Liboton\n\nNaga City, Philippines 4400\n\nYou may also contact us at:\n09171485103\nyourfriends@gsync.solutions"
            }
        }
        else if(iskeywordContact){
            response = {
                "text": "You May contact us at:\n\nContact Numbers: \n+63 917 148 5103\n+63 917 544 9777\n+63 977 692 5903\n\nLandline Numbers:\n+63 54 8810167\n+63 46 2310601\n\nEmail Address:\nyourfriends@GSYNC.solutions\nGSYNC.solutions.ph@outlook.com\n\nGSYNC Solutions Philippines is located at:\n\n8 Santol St, Liboton\n\nNaga City, Philippines 4400"
            }
        }
        else{
            response={
                "text": "Sorry, we could not understand your inquiry."
            }
        }
    } 
    callSendAPI(sender_psid, response)
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

/* const callSendAPI = async (sender_psid, response) => {
    console.log("trying to send message!");
    let request_body ={
        "recipient": {
            "id": sender_psid
        },
        "message": response
      }
      const VERIFY_ACCESS_TOKEN = process.env.VERIFY_ACCESS_TOKEN;

      try{
        const response = await fetch(`https://graph.facebook.com/v17.0/me/messages?access_token=${VERIFY_ACCESS_TOKEN}`, { 
            "method": "POST",
            body: JSON.stringify(request_body),
            headers: {'Content-Type': 'application/json'}
        }, 3);
        const result = await response.json();
        console.log(result);
      } catch (err){
        console.error('Error sending message:', err)
      }
}  */
    






module.exports = {
    homePage:homePage,
    getWebhook:getWebhook,
    postWebhook:postWebhook
};