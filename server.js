const express = require('express');
const pino = require('pino');
const logger = pino();

const app = express();
app.use(express.json());

app.post('/webhook', (req, res) => {
  logger.info({ payload: req.body }, '📥 Mensaje recibido');
  res.sendStatus(200);
});

app.get('/webhook', (req, res) => {
  const verify_token = "agentify-token";
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === verify_token) {
    logger.info('🟢 Webhook verificado correctamente');
    res.status(200).send(challenge);
  } else {
    logger.warn('🔴 Verificación del webhook fallida');
    res.sendStatus(403);
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  logger.info(`🚀 Servidor escuchando en puerto ${PORT}`);
});
