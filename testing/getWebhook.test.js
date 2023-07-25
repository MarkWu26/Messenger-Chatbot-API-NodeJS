const request = require('supertest')
import initWebRoutes from "../src/routes/web";
import express from "express";


describe('getWebhook', ()=> {
    test("should verify the webhook when provided with the correct verify token", ()=>{
        const YOUR_VERIFY_TOKEN = process.env.VERIFY_ACCESS_TOKEN;
        const challenge = "challenge";
        const app = express();
        app.use('/', initWebRoutes());

        const response = request(app).get('/webhook').query({
            'hub.mode': 'subscribe',
            'hub.verify_token': YOUR_VERIFY_TOKEN,
            'hub.challenge': challenge
        })

        expect(response.status).toBe(200);
        expect(response.text).toBe(challenge);
    })
})