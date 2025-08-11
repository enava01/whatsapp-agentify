const express = require('express');
const pino = require('pino');
const logger = pino();

const { handleIncoming } = require('./src/router');
const { askLLM } = require('./src/llm');

const app = express();
app.use(express.json());

// WhatsApp webhook (POST): procesa mensajes
app.post('/webhook', async (req, res) => {
  logger.info({ payload: req.body }, '📥 Mensaje recibido');
  try {
    await handleIncoming(req.body);   // <-- Llama a Vertex y responde por WA
  } catch (err) {
    logger.error({ err }, '❌ Error procesando webhook');
  }
  // Siempre responde 200 a Meta
  res.sendStatus(200);
});

// WhatsApp webhook (GET): verificación
app.get('/webhook', (req, res) => {
  const verify_token = process.env.META_VERIFY_TOKEN || "agentify-token";
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

// Endpoint de prueba del LLM (para afinar tu YAML)
app.post('/test-llm', async (req, res) => {
  try {
    const prompt = req.body?.prompt || 'Di hola en 1 oración';
    const text = await askLLM(prompt);
    res.json({ ok: true, model: process.env.VERTEX_MODEL_ID || 'gemini-2.0-flash-lite', text });
  } catch (e) {
    logger.error(e);
    res.status(500).json({ ok: false, error: String(e) });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`🚀 Servidor escuchando en puerto ${PORT}`);
});
