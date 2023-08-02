import express from "express";

import chatbotController from "../controllers/chatbotController"

const router = express.Router();

const initWebRoutes = (app) => {
    // Define a GET route for the home page
    // When a user makes a GET request to the root URL "/", it will be handled by the homePage function in the chatbotController
    router.get("/", chatbotController.homePage);

    // Define a GET route for the webhook verification
    // When Facebook sends a GET request to the "/webhook" URL for verification, it will be handled by the getWebhook function in the chatbotController
    router.get("/webhook", chatbotController.getWebhook);

    // Define a POST route for handling incoming webhook events
    // When Facebook sends a POST request to the "/webhook" URL with incoming events, it will be handled by the postWebhook function in the chatbotController
    router.post("/webhook", chatbotController.postWebhook);

    // Attach the router middleware to the main Express.js app
    // This allows the defined routes to be used by the main app
    return app.use("/", router);
}


module.exports = initWebRoutes;