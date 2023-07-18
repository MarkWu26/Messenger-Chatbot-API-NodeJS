require("dotenv").config();

import request from "request";

/* import axios from "axios";

setPersistentMenu(); */

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
        body.entry.forEach(function(entry) {
            const webhookEvent = entry.messaging[0];
            console.log(webhookEvent);
        
        const sender_psid = webhookEvent.sender.id;
        console.log(`sender Id: ${sender_psid}`);

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
    let response = {
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
        response ={
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": "Thank you for your interest in GSYNC Solutions!\nPlease Select an option below to know more about us:",
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Nature of Business",
                            "payload": "nature of business"
                          },
                          {
                            "type": "postback",
                            "title": "Vision and Mission",
                            "payload": "vision and mission"
                          },
                          {
                            "type": "postback",
                            "title": "History and Founder",
                            "payload": "history"
                          }
                    ]
                }
            }
        }
        break;

        case "nature of business":
            response ={
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": "GSYNC Solutions Philippines, OPC is consulting, engineering, technical, environmental and solutions services company syncing the right professionals and experts needed for effective, sustainable and affordable location intelligence solutions and applications.",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Nature of Business",
                                "payload": "nature of business"
                              },
                              {
                                "type": "postback",
                                "title": "Vision and Mission",
                                "payload": "vision and mission"
                              },
                              {
                                "type": "postback",
                                "title": "History and Founder",
                                "payload": "history"
                              }
                        ]
                    }
                }
            }
        break;

        case "vision and mission":
            response ={
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": "Vision\n\nGSYNC Solutions Philippines, OPC envision a smart, resilient and sustainable Philippines composed of smart cities, smart municipalities, and smart businesses servicing happy positive resilient communities.\n\nMission\nGSYNC Solutions Philippines, OPC aims to achieve the following:\n\n - Bring global, client-focused knowledge, practices and location intelligence solutions to the Philippines through localized services and synergy of professionals\n - Be the first choice in geospatial technology solutions and related services.\n - Make everyone’s life easier and better by creating more effective and efficient organizations and individuals.",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Nature of Business",
                                "payload": "nature of business"
                              },
                              {
                                "type": "postback",
                                "title": "Vision and Mission",
                                "payload": "vision and mission"
                              },
                              {
                                "type": "postback",
                                "title": "History and Founder",
                                "payload": "history"
                              }
                        ]
                    }
                }
            }
            aboutButtons(sender_psid);

            break;

        case "history":
            response ={
              
                        "text": "ENGR. OLIVER BELENO BARBOSA\n- Founder and CEO, GSYNC Solutions Australia and Philippines GIS and Automation Specialist IT Release and Process Manager. 20 years of experience in both government and private organizations mainly in IT business specializing in GIS and spatial solutions.\n\nBeing “Iskolars ng Bayan” at heart, parallel 20 years’ achievements on the separate salient areas of professional geospatial technology practices was catalyzed by our CEO last 2019, who had already migrated to Australia for a decade, to answer a grand yet purposeful calling and challenge.\n\nGSYNC Solutions is registered and based in Australia to focus on the Geospatial Solutions product ensuring this is in touch with the latest in the technology and information system solutions and services that first world countries have to offer, including software architecture and approaches and methodologies which will be rolled out to client countries including the Philippines. Immediate planned rollout targets are Australia itself, Malaysia, and France.\n\nGSYNC Solutions Philippines is registered and based in the Philippines to focus on Geospatial Solution Services, structured to overcome identified challenges of how the technology and related technical and consultancy services can be used to benefit the communities. It incorporates GSYNC Engineering Consultancy and GSYNC Business Consultancy Services.",
                       
                    }
                    aboutButtons(sender_psid);
                
        break;

        //main category services
        case "services": 
        response ={
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": "Here are the different types of services we offer.\nPlease Select an option below to know more about the services we offer:",
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Our Services",
                            "payload": "our services"
                          },
                          {
                            "type": "postback",
                            "title": "Online Payment",
                            "payload": "online payment"
                          },
                          {
                            "type": "postback",
                            "title": "Partnered Companies",
                            "payload": "partnered companies"
                          }
                    ]
                }
            }
        }
        break;

        case "our services":

        response ={
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": " We provide technical project services on telecommunications, water resources, environmental studies, coastal engineering, structural engineering and civil works, construction management and geotechnical engineering.\n\nFor Technical and Engineering (T&E) services offered, visit our webpage here:\n\nFor Enterprise Business Intelligence System (EnBIS) - visit our webpage here: ",
                    // we plan to create webpage for each operation, kapag may link na for TE, ilagay dito ang webpage link)
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Our Services",
                            "payload": "our services"
                          },
                          {
                            "type": "postback",
                            "title": "Online Payment",
                            "payload": "online payment"
                          },
                          {
                            "type": "postback",
                            "title": "Partnered Companies",
                            "payload": "partnered companies"
                          }
                    ]
                }
            }
        }
           
        break;

        case "online payment":
            response ={
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": "Yes. It is available and perform using Online secure payment facility, shopping cart style.",
                        
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Our Services",
                                "payload": "our services"
                              },
                              {
                                "type": "postback",
                                "title": "Online Payment",
                                "payload": "online payment"
                              },
                              {
                                "type": "postback",
                                "title": "Partnered Companies",
                                "payload": "partnered companies"
                              }
                        ]
                    }
                }
            }


        break;

        case "partnered companies":
            response ={
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": " We have several companies that trust us in providing the best services:          \n\n- NetLink Advance Solutions, Inc.\n\n- SmartGeo Surveying and Geomatics\n\n- GeoDecision\n\n- GeoTech Mercantile Corp.\n\n- Prism Express Consulting Inc.\n\n- DevKinetics  \n\n- Pertconsult International\n\n- Radar Aero Resources\n\n- BCM Surveying",                       
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Our Services",
                                "payload": "our services"
                              },
                              {
                                "type": "postback",
                                "title": "Online Payment",
                                "payload": "online payment"
                              },
                              {
                                "type": "postback",
                                "title": "Partnered Companies",
                                "payload": "partnered companies"
                              }
                        ]
                    }
                }
            }

           
        break;

        case "policies and projects":
            response ={
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": "Thank you for your interest in GSYNC Solutions!\nPlease Select an option below to know more about the company's policies and projects",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Business Policies",
                                "payload": "policy"
                              },
                              {
                                "type": "postback",
                                "title": "Accomplished Projects",
                                "payload": "accomplished projects"
                              },
                        ]
                    }
                }
            }

        break;

        case "policy":
            response ={
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": "Business policies are in place to ensure that we guide, direct and protect both the company and its employees.\n\nOur initial policies include:\n- Customer Quality Policy\n- Credit Policy\n- Ethics & Conduct Policy\n- Employment Policies\n- Nondiscrimination Policies\n- Compensation and Benefits Policies\n- Internet, Email, & Cyber-security Policy\n- Misconduct Policy, Purchasing Policy, and Workplace Safety Policy.",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Business Policies",
                                "payload": "policy"
                              },
                              {
                                "type": "postback",
                                "title": "Accomplished Projects",
                                "payload": "accomplished projects"
                              },
                        ]
                    }
                }
            }

          
        break;

        case "accomplished projects":
            response ={
                        "text": "Here are just some of the projects of GYSNC Solutions successfully undertaken : \n- Solution Services\n- Tax Mapping Business Intelligence System for Sipocot, Camarines Sur. 2020\n- Tax Mapping Business Intelligence System for San Fernando, Camarines Sur. 2020\n- Tax Mapping Business Intelligence System for Magarao, Camarines Sur. 2020\n- Infrastructure Information Management Business Intelligence System for Carmona, Cavite. 2020\n\nLGU Plans Creation & CCA Alignments Review\n- Comprehensive Land Use Plan (CLUP) for Sipocot, Camarines Sur. 2020\n- Comprehensive Land Use Plan for (CLUP) Castilla, Sorsogon. 2020\n- Validation of Alignments for Resiliency Review of LGU Plans including Comprehensive Land Use Plan, Community Development Plan, and Local Climate Change Action Plan, Pasacao, Camarines Sur. 2020"
            }
            accomplishButtons(sender_psid);
        break;

        default:
            response = {
            "text": "Sorry, we couldn't understand your inquiry."
            }
        break;
    }

   

    callSendAPI(sender_psid, response)
}

//send new button options for accomplishment since the reply text is too long, can't use the button template
const accomplishButtons= (sender_psid) =>{
    const newResponse = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                
                "text": "If you would like to know more,\Select an option below:",
                "buttons": [
                    {
                        "type": "postback",
                        "title": "Business Policies",
                        "payload": "policy"
                      },
                      {
                        "type": "postback",
                        "title": "Accomplished Projects",
                        "payload": "accomplished projects"
                      },
                ]
            }
        }
    }
    callSendAPI(sender_psid, newResponse)
}
//send new button options for history & Founder and Vission & Mission since the reply text is too long, can't use the button template
const aboutButtons = (sender_psid) =>{
    const newResponse = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "If you would like to know more,\Select an option below:",
                "buttons": [
                    {
                        "type": "postback",
                        "title": "Nature of Business",
                        "payload": "nature of business"
                      },
                      {
                        "type": "postback",
                        "title": "Vision and Mission",
                        "payload": "vision and mission"
                      },
                      {
                        "type": "postback",
                        "title": "History and Founder",
                        "payload": "history"
                      }
                ]
            }
        }
    }
    callSendAPI(sender_psid, newResponse)
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

/* const callMessengerAPI = async (request_body) => {
    try{
        const response = await axios.post("https://graph.facebook.com/v17.0/me/messenger_profile?platform=facebook", request_body);
        console.log("Success, the response is:", response.data)
    }
    catch(err){
        console.error("Error calling API", err.response.data)
    }
}

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
                    "payload": "policy"
                }
            ]
            }
        ]
    }

    callMessengerAPI(request_body)
} */

module.exports = {
    test:test,
    getWebhook:getWebhook,
    postWebhook:postWebhook
};