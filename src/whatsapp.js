// src/whatsapp.js
// src/whatsapp.js
// src/whatsapp.js
const fetch = global.fetch || ((...args) => import('node-fetch').then(({ default: f }) => f(...args)));

async function sendText(to, body) {
  const url = `https://graph.facebook.com/v20.0/${process.env.PHONE_NUMBER_ID}/messages`;
  const ac = new AbortController();
  const timeout = setTimeout(() => ac.abort(), 8000);

  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.META_PERMANENT_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body }
      }),
      signal: ac.signal
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { sendText };
