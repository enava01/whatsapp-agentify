// src/llm.js
const { VertexAI } = require('@google-cloud/vertexai');
const fs = require('fs');
const path = require('path');

const vertex = new VertexAI({
  project: process.env.GCP_PROJECT,
  location: process.env.GCP_LOCATION || 'us-central1',
});

let SML;
function getSML() {
  if (SML) return SML;
  const candidates = [
    path.join(__dirname, '../sml.yaml'),
    path.join(__dirname, './config/sml.yaml'),
    path.join(process.cwd(), 'sml.yaml'),
    path.join(process.cwd(), 'config', 'sml.yaml'),
  ];
  for (const p of candidates) if (fs.existsSync(p)) { SML = fs.readFileSync(p, 'utf8'); break; }
  if (!SML) SML = 'version:1\npersona:\n  nombre: "Asesor Agentify"\n  tono: "amable, claro"\npoliticas:\n  - "Responde corto y claro."\n';
  return SML;
}

function pickModel() {
  return process.env.VERTEX_MODEL_ID || 'gemini-2.0-flash-lite';
}

// --- NUEVO: helper para extraer texto del objeto de Vertex
function unwrapVertexText(resp) {
  try {
    const parts = resp?.response?.candidates?.[0]?.content?.parts || [];
    const text = parts.map(p => p?.text || '').join('').trim();
    return text || '(sin texto)';
  } catch {
    return JSON.stringify(resp);
  }
}

async function askLLM(userText) {
  const model = vertex.getGenerativeModel({
    model: pickModel(),
    systemInstruction: getSML(),
  });

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: userText }]}],
    generationConfig: { temperature: 0.3, maxOutputTokens: 512 }
  });

  return unwrapVertexText(result);   // <-- en vez de result.response.text()
}

module.exports = { askLLM };
