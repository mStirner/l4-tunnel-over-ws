const WebSocket = require("ws");
const express = require("express");

console.clear();
const app = express();

const wss = new WebSocket.Server({
    server: app
});

wss.on("connection", (ws, req) => {

    ws.on("close", () => {
        console.log("Connection closed")
    });

    ws.on("ping", () => {
        console.log("ping from server received");
    });

    ws.on("pong", () => {
        console.log("pong from server received");
    });

    setInterval(() => {
        ws.send(Date.now())
    }, 3000);
});

app.use((req, res) => {

    console.log("Rquest url", req.url);

    wss.handleUpgrade(req, req.socket, req.headers, (ws, request) => {
        wss.emit("connection", ws, request);
    });

});

app.listen(8081)