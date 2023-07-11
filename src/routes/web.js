import { ModulesOption } from "@babel/preset-env/lib/options";
import express from "express";
import chatbotController from "../controllers/chatbotController";
const router = express.Router();

const initWebRoutes = (app) => {
    router.get("/", chatbotController.test)
    return app.use("/", router);

}

module.exports = initWebRoutes;