import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";


const app = express();

viewEngine(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

initWebRoutes(app);

const port = process.env.port || 8080;

app.listen(port, ()=>{
    console.log(`server is listening on port: ${port}`)
})