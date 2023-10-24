import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./api/routes";
import bodyParser from "body-parser";
import fptconfig from "../src/api/config/fptconfig.js";

dotenv.config();

var http = require('http');
var app = express();
var server = http.createServer(app);

// Register middleware
app.use(express.json());
app.use(cookieParser());

// Static files
app.use("/src/public", express.static('./src/public/'));
app.use(cors());

// Error handler
app.use((err, req, res, next) => {
    const {
        status = 404, message = "Error"
    } = err;
    res.status(status).json({
        message
    });
});

const PORT = process.env.PORT || 5050;;
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to express"
    });
});

app.use("/api", router);

app.use('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
})

// FTP client
// const ftp = require("basic-ftp");
// const ftpConfig = require("../src/api/config/fptconfig.js");
// const client = new ftp.Client();
// client.ftp.verbose = true
// try {
//     client.access({
//         host: ftpConfig.FTP_HOST,
//         user: fptconfig.FTP_USER,
//         password: fptconfig.FTP_PASSWORD,
//         sercure: true
//     }).then(() => {
//         console.log("FTP-Connected");
//     })
// } catch (err) {
//     console.log(err);
// }  