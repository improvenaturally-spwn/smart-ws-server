const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

const clients = {};

// Basit benzersiz ID üretici (harici paket yok)
function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

app.get("/", (req, res) => {
  res.send("Smart WebSocket Server aktif 🚀");
});

wss.on("connection", (ws) => {
  const clientId = generateId();
  clients[clientId] = ws;

  console.log("Yeni bağlantı:", clientId);

  ws.send(JSON.stringify({
    type: "welcome",
    clientId: clientId
  }));

  ws.on("message", (message) => {
    let data;

    try {
      data = JSON.parse(message.toString());
    } catch {
      console.log("JSON parse hatası");
      return;
    }

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
        clients[target].send(JSON.st
