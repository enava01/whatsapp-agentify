const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhook', (req, res) => {
  console.log('📥 Mensaje recibido:', JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

app.get('/webhook', (req, res) => {
  const verify_token = "agentify-token";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === verify_token) {
    console.log("🟢 Webhook verificado");
    res.status(200).send(challenge);
  } else {
    console.log("🔴 Verificación fallida");
    res.sendStatus(403);
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
});
