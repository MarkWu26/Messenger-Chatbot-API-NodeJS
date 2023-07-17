require('dotenv').config();
import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";


const app = express();



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

viewEngine(app);

initWebRoutes(app);

const port = process.env.PORT || 8080;

app.listen(port, ()=>{
    console.log(`server is listening on port: ${port}`)
})