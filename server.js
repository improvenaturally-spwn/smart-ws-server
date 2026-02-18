const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

const clients = {};

app.get("/", (req, res) => {
  res.send("Smart WebSocket Server aktif 🚀");
});

wss.on("connection", (ws) => {

  ws.on("message", (message) => {

    let data;

    try {
      data = JSON.parse(message.toString());
    } catch {
      return;
    }

    // Client kendini register ediyor
    if (data.type === "register") {
      clients[data.clientId] = ws;

      ws.send(JSON.stringify({
        type: "registered",
        clientId: data.clientId
      }));

      console.log("Registered:", data.clientId);
      return;
    }

    // Private mesaj
    if (data.type === "private") {
      const target = data.targetId;

      if (clients[target] && clients[target].readyState === WebSocket.OPEN) {
        clients[target].send(JSON.stringify({
          type: "private",
          from: data.from,
          message: data.message
        }));
      }
    }

  });

  ws.on("close", () => {
    console.log("Bağlantı kapandı");
  });

});

server.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
  console.log("WebSocket Server aktif 🚀");
});
