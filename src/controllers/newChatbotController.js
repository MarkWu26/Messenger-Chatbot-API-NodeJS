require("dotenv").config();

import request from "request";
import aboutUs from "../responses/aboutUs.json"
import services from "../responses/services.json"
import policies from "../responses/policies.json"
import natureOfBusiness from "../responses/natureOfBusiness.json"
import visionAndMission from "../responses/visionAndMission.json"
import ourServices from "../responses/ourServices.json"
import onlinePayment from "../responses/onlinePayment.json"
import partneredCompanies from "../responses/partneredCompanies.json"
import policy from "../responses/policy.json"



let isPersistentMenuSet = false;

const callMessengerAPI = async (request_body) => {
    console.log("Calling Messenger API")
    try {
      const { default: fetch } = await import('node-fetch');
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

        // Call setPersistentMenu initially
      if (isPersistentMenuSet === false) {
        setPersistentMenu();
        isPersistentMenuSet = true;
      }

        if(webhookEvent.message){
           handleMessage(sender_psid, webhookEvent.message)
           sendWelcomeMessage(sender_psid);
        }
        else if(webhookEvent.postback){
           handlePostBack(sender_psid, webhookEvent.postback)
        }
        });
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

        // we plan to create webpage for each operation, kapag may link na for TE, ilagay dito ang webpage link
        case "our services":
        response = ourServices;
        break;

        case "online payment":
            response = onlinePayment;
        break;

        case "partnered companies":
            response = partneredCompanies;  
        break;
        
        //main category for policies and projects
        case "policies and projects":
        response = policies;
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
        response = {
            "text": `You sent the message: "${received_message.text}".  `
        }
    }

    callSendAPI(sender_psid, response)
}

// Sends response messages via the Send API
const callSendAPI = (sender_psid, response) => {
    console.log("trying to send message!")

  let request_body ={
    "recipient": {
        "id": sender_psid
    },
    "message": response
  }

  
    request({
    "uri": "https://graph.facebook.com/v17.0/me/messages",
    "qs": { "access_token": process.env.VERIFY_ACCESS_TOKEN},
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  });   



}

 

module.exports = {
    homePage:homePage,
    getWebhook:getWebhook,
    postWebhook:postWebhook
};