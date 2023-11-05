require("dotenv/config");
const express = require("express");
const cors = require("cors");
const { join } = require("path");
const bearerToken = require('express-bearer-token');
require('dotenv').config({path:join(__dirname,'../.env')});

const PORT = process.env.PORT || 8000;
const app = express();
// app.use(
//     cors({
//         origin: [
//             process.env.WHITELISTED_DOMAIN &&
//                 process.env.WHITELISTED_DOMAIN.split(","),
//         ],
//     })
// );
app.use(cors());
app.use(express.json());
app.use(bearerToken());
app.use(express.static('src/public'));
app.use('/api', express.static(__dirname + '/public'));

//#region API ROUTES
const userRouter = require('./routers/userRouter');
const productRouter = require('./routers/productRouter');
const categoryRouter = require('./routers/categoryRouter');
const transactionRouter = require('./routers/transactionRouter');

// ===========================
// NOTE : Add your routes here
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/category', categoryRouter);
app.use('/api/transaction', transactionRouter);

app.get("/api", (req, res) => {
    res.send(`Hello, this is my API`);
});

app.get("/api/greetings", (req, res, next) => {
    res.status(200).json({
        message: "Hello, welcome to the Back-end"
    });
});

// ===========================

// not found
app.use((req, res, next) => {
    if (req.path.includes("/api/")) {
        res.status(404).send("Not found !")
    } else {
        next();
    }
});

// error
app.use((err, req, res, next) => {
    if(req.path.includes("/api/")) {
        console.log("Error : ", err.stack);
        res.status(500).send("Internal Server Error!");
    } else {
        next();
    }
});

//#endregion

//#region CLIENT
const clientPath = "../../client/build";
app.use(express.static(join(__dirname, clientPath)));

// serve the HTML page
app.get("*", (req, res) => {
    res.sendFile(join(__dirname, clientPath, "index.html"));
});

//#endregion

app.listen(PORT, (err) => {
    if (err) {
        console.log(`ERROR: ${err}`);
    } else {
        console.log(`APP RUNNING at ${PORT} ✅`);
    }
});