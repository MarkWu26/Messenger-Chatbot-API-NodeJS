<<<<<<< HEAD
import { ModulesOption } from "@babel/preset-env/lib/options";
import express from "express";
import chatbotController from "../controllers/chatbotController";

=======
import express from "express";
//import chatbotController from "../controllers/chatbotController";
import chatbotController from "../controllers/newChatbotController"
>>>>>>> origin/master

const router = express.Router();

const initWebRoutes = (app) => {
<<<<<<< HEAD
    router.get("/", chatbotController.test)
=======
    router.get("/", chatbotController.homePage)
>>>>>>> origin/master
    router.get("/webhook", chatbotController.getWebhook)
    router.post("/webhook", chatbotController.postWebhook)
    return app.use("/", router);
    
}


module.exports = initWebRoutes;