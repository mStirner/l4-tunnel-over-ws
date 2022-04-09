# Description
The code demonstrate how to use a WebSocket client/server connection to tunnel layer 4 connection to the WebSocket.
This allow us to implement higher level of the OSI layer in the server side without update every time the client on the target network.

# Demo
Start the server with `node.index` & change in the [`bridge.js`](./bridge.js) you network target: `bridge(ws, "127.0.0.1", 8081);`

The code is currently tunneling WebSocket connections over WebSockets.
Works also with any other applicattion layer even with tcp/udp.

Raw sockets are coming in further versions, e.g. for ICMP.