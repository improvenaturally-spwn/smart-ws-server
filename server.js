const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("WebSocket Server aktif 🚀");
});

wss.on("connection", function connection(ws) {
  console.log("Yeni client bağlandı");

  ws.on("message", function incoming(message) {
    console.log("Gelen mesaj:", message.toString());

    // Gelen mesajı herkese yayınla
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on("close", () => {
    console.log("Client ayrıldı");
  });
});

server.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
