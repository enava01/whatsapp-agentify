// src/llm.js
const { VertexAI } = require('@google-cloud/vertexai');
const fs = require('fs');

const vertex = new VertexAI({
  project: process.env.GCP_PROJECT,
  location: process.env.GCP_LOCATION || 'us-central1',
});

const SML = fs.readFileSync('./config/sml.yaml', 'utf8');

function pickModel() {
  return process.env.VERTEX_MODEL_ID || 'gemini-2.0-flash-lite';
}

async function askLLM(userText) {
  const model = vertex.getGenerativeModel({
    model: pickModel(),
    systemInstruction: SML,
  });

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: userText }]}],
    generationConfig: { temperature: 0.3, maxOutputTokens: 512 },
  });

  return result.response.text();
}

module.exports = { askLLM };
