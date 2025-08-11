// src/router.js
const { askLLM } = require('./llm');
const { sendText } = require('./whatsapp');

async function handleIncoming(body) {
  const change = body?.entry?.[0]?.changes?.[0];
  const msg = change?.value?.messages?.[0];
  if (!msg || msg.type !== 'text') return;

  const waId = msg.from;
  const userText = msg.text?.body || '';

  const reply = await askLLM(userText);
  await sendText(waId, reply);
}

module.exports = { handleIncoming };
