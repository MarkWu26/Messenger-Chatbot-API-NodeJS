import express from "express";
//import chatbotController from "../controllers/chatbotController";
import chatbotController from "../controllers/chatbotController"

const router = express.Router();

const initWebRoutes = (app) => {
    router.get("/", chatbotController.homePage)
    router.get("/webhook", chatbotController.getWebhook)
    router.post("/webhook", chatbotController.postWebhook)
    return app.use("/", router);
    
}


module.exports = initWebRoutes;