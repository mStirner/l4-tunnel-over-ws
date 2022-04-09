const WebSocket = require("ws");
const { Agent } = require("http");

console.clear();

const wss = new WebSocket.Server({
    port: 8080
});

wss.on("listening", (err) => {
    console.log(err || "listneing");
});

function heartbeat() {
    this.isAlive = true;
}


const interval = setInterval(() => {
    wss.clients.forEach((ws) => {

        if (ws.isAlive === false) {
            return ws.terminate();
        }

        ws.isAlive = false;
        ws.ping();

    });
}, 10000);


wss.on('close', function close() {
    clearInterval(interval);
});


wss.on("connection", (ws) => {

    console.log("client connected");

    ws.on("ping", () => {
        console.log("[server] ping received");
    });

    ws.on("pong", () => {
        console.log("[server] pong received");
    });

    ws.isAlive = true;
    ws.on('pong', heartbeat);

    let upstream = WebSocket.createWebSocketStream(ws, {
        // duplex stream options
        //emitClose: false,
        //objectMode: true,
        //decodeStrings: false
        allowHalfOpen: true
    });

    let agent = new Agent();

    agent.createConnection = (options, cb) => {

        //console.log("agent.createConnection", options, cb);

        upstream.setTimeout = () => { };
        upstream.setNoDelay = () => { };

        return upstream;

    };


    // ws://192.168.2.100:8001/api/v2/channels/samsung.remote.control?name=T3BlbkhhdXM=
    // ws://192.168.2.4:443
    let client = new WebSocket("ws://192.168.2.100:8001/api/v2/channels/samsung.remote.control?name=T3BlbkhhdXM=", {
        agent
    });


    client.on("ping", () => {
        console.log("[client] ping received");
    });

    client.on("pong", () => {
        console.log("[client] pong received");
    });

    setInterval(() => {
        client.ping();
    }, 2000);

    setTimeout(() => {
        client.close();
    }, 5000);

    client.on("message", (msg) => {

        msg = JSON.parse(msg);

        console.log("[%d]", Date.now(), msg)

        /*
            setTimeout(() => {
    
                console.log("SEND: KEY_CHUP");
    
                ws.send(JSON.stringify({
                    "method": "ms.remote.control",
                    "params": {
                        "Cmd": "Click",
                        "DataOfCmd": "KEY_CHUP",
                        "Option": "false",
                        "TypeOfRemote": "SendRemoteKey"
                    }
                }));
    
            }, 10000)*/

    });


    client.on("close", (code, reason) => {
        console.log("Client connection closed", code, reason)
    });


});