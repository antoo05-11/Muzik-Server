import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./api/routes";
import bodyParser from "body-parser";

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



// Database
// import { DataTypes, Sequelize } from "sequelize";
// const dbconfig = require('../src/config/dbconfig.js');
// const sequelize = new Sequelize(
//     dbconfig.DATABASE,
//     dbconfig.USER,
//     dbconfig.PASSWORD,
//     {
//         host: dbconfig.HOST,
//         dialect: dbconfig.dialeg,
//         operatorsAliases: false,
//         pool: {
//             max: dbconfig.pool.max,
//             min: dbconfig.pool.min,
//             acquire: dbconfig.pool.acquire,
//             idle: dbconfig.pool.idle
//         }
//     }
// )
// sequelize.authenticate().then(() => {
//     console.log("connected...");
// }).catch(e => { console.log(e); })

// const db = {};
// db.Sequelize = Sequelize
// db.sequelize = sequelize

// db.songs = require('./api/models/song.js')(sequelize,DataTypes)

// db.sequelize.sync({ force: false })
// .then(() => {
//     console.log('yes re-sync done!')
// })

// export default db;

// FTP client
// const ftp = require("basic-ftp");
// const client = new ftp.Client();
// client.ftp.verbose = true
// try {
//     client.access({
//         host: process.env.FTP_HOST,
//         user: process.env.FTP_USER,
//         password: process.env.FTP_PASSWORD,
//         sercure: true
//     }).then(() => {
//         // console.log("FTP-Connected");
//         // client.uploadFrom("D:/UET-Forum/UET-Forum/server/README.md", "/public_html/imageResource/README.md");
//     })
// } catch (err) {
//     console.log(err);
// }

