require('dotenv').config();
import express from "express";
import bodyParser from "body-parser";
import initWebRoutes from "./routes/web";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

initWebRoutes(app);

const port = process.env.PORT || 8080;

module.exports = app;

app.listen(port, ()=>{
    console.log(`server is listening on port: ${port}`)
});