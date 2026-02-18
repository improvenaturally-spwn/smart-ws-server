const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

const clients = {};

app.get("/", (req, res) => {
  res.send("Smart WebSocket Server aktif 🚀");
});

wss.on("connection", (ws) => {
  const clientId = uuidv4();
  clients[clientId] = ws;

  console.log("Yeni bağlantı:", clientId);

  ws.send(JSON.stringify({
    type: "welcome",
    clientId: clientId
  }));

  ws.on("message", (message) => {
    const data = JSON.parse(message.toString());

    if (data.type === "broadcast") {
      Object.keys(clients).forEach(id => {
        if (clients[id].readyState === WebSocket.OPEN) {
          clients[id].send(JSON.stringify({
            type: "broadcast",
            from: clientId,
            message: data.message
          }));
        }
      });
    }

    if (data.type === "private") {
      const target = data.targetId;
      if (clients[target] && clients[target].readyState === WebSocket.OPEN) {
        clients[target].send(JSON.stringify({
          type: "private",
          from: clientId,
          message: data.message
        }));
      }
    }
  });

  ws.on("close", () => {
    delete clients[clientId];
    console.log("Bağlantı kapandı:", clientId);
  });
});

server.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
  console.log("WebSocket Server aktif 🚀");
});
