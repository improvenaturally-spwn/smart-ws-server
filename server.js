const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("HTTP Server çalışıyor 🚀");
});

wss.on("connection", (ws) => {
  console.log("Yeni WebSocket bağlantısı!");

  ws.send("Sunucuya bağlandın 🚀");

  ws.on("message", (message) => {
    console.log("Gelen mesaj:", message.toString());
    ws.send("Mesaj alındı: " + message);
  });
});

server.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
  console.log("WebSocket Server aktif 🚀");
});
