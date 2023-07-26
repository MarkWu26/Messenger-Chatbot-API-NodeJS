require("dotenv").config();
import request from 'supertest';
import app from '../src/server';
import initWebRoutes from "../src/routes/web"

initWebRoutes(app);


describe('getWebhook', ()=> {


    test("should verify the webhook when provided with the correct verify token", async ()=>{
      
        const challenge = "CHALLENGE_ACCEPTED";
   

       const response = await request(app).get('/webhook').query({
            'hub.mode': 'subscribe',
            'hub.verify_token': "GSYNCITTEAM123",
            'hub.challenge': challenge
        });
        expect(response.status).toBe(200);
        expect(response.text).toBe(challenge);
        });
    });