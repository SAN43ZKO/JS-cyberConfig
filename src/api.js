const express = require("express");
const app = express();
const db = require("./db.js");
const fs = require("node:fs");
const limiter = require("./limiter.js");

//Get JSON response
async function getJsonResponse() {
    app.set("json spaces", 2);
    app.get("/api/config/base", (req, res) => {
        res.json(db.resultJson);
    });
}
exports.getJsonResponse = getJsonResponse



async function postJsonRequest() {
    // app.use(limiter.limiter);
    app.use(express.json());
    app.post("/api/config/create", (req, res) => {
        let content = ""
        for (const [key, value] of Object.entries(req.body)) {
            for (const item of value.commands) {
                content += `${item.name}: "${item.value}"\n`;
            }
        }

        const id = Math.floor(Math.random() * 10000000000);

        const fileName = id + "." + new Date().getDate() + "-" + new Date().getMonth() + "-" + new Date().getFullYear() + "-" + new Date().getHours() + "-" + new Date().getMinutes();
        fs.writeFile(`./download/cfg/${fileName}.cfg`, content, function (err) {
            if (err) {
                console.log(err);
            }
        });
        const pathFile = {
            "path": `/download/cfg/${fileName}.cfg`,
        }
        res.json(pathFile);
    });
}
exports.postJsonRequest = postJsonRequest


async function listenPort() {
    const port = 25565;
    app.disable('x-powered-by');
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
}
exports.listenPort = listenPort