#!/usr/bin/env node

const child_process = require("child_process");
const WebSocket = require("ws");


// http://127.0.0.1:8080/api/devices/6042785432c51e3e98e7acc0/interfaces/6042785432c51e3e98e7acc1

function bridge(ws, host, port) {

    // create stream from websocket
    const stream = WebSocket.createWebSocketStream(ws);

    /*
        ws.on("message", (message) => {
            console.log("Send to device", message)
        });
    */

    ws.on("close", () => {
        console.error("Disconnected from WebSocket: %s", ws.url);
        process.exit(0);
    });


    ws.on("open", () => {

        console.log(`Connected to WebSocket: "%s"`, ws.url);

        let nc = child_process.spawn("nc", [host, port]);


        nc.on("error", () => {
            console.log("netcat error");
        });

        nc.on("close", () => {
            console.log("netcat closed");
        });

        nc.on("spawn", () => {
            console.log("netcat spawend");
        });

        nc.stderr.pipe(process.stderr);

        stream.pipe(nc.stdin);
        nc.stdout.pipe(stream);


    });

}



const ws = new WebSocket("ws://127.0.0.1:8080");


// 192.168.2.100:8001
//bridge(ws, "192.168.2.4", 443);
//bridge(ws, "192.168.2.100", 8001);
bridge(ws, "127.0.0.1", 8081);