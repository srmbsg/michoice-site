// MiChoice chat voice — ElevenLabs TTS (Matilda, the standing MiChoice walkthrough voice).
// Key read from ELEVENLABS_API_KEY env var (Vercel project). Perishable: plan ends 2026-12-01.
const VOICE_ID = 'XrExE9yKIg1WjnnlVkGX'; // Matilda — Knowledgeable, Professional

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.getmichoice.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  const text = ((body && body.text) || '').toString().trim().slice(0, 800);
  if (!text) return res.status(400).json({ error: 'empty text' });

  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) return res.status(500).json({ error: 'voice not configured' });

  // "Mi..." product names are pronounced "my" — phonetic respelling for TTS only.
  const spoken = text
    .replace(/\bMiChoice\b/g, 'MyChoice')
    .replace(/\bmiMealMoney\b/g, 'myMealMoney')
    .replace(/\bmiMeal\b/g, 'myMeal')
    .replace(/\bmiComs\b/g, 'myComs')
    .replace(/\bmiFAR\b/g, 'myFAR')
    .replace(/\bmiInventory\b/g, 'myInventory')
    .replace(/\bmiTimes\b/g, 'myTimes')
    .replace(/\bMiAgentic\b/g, 'MyAgentic');

  try {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: { 'xi-api-key': key, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg' },
      body: JSON.stringify({ text: spoken, model_id: 'eleven_turbo_v2_5', voice_settings: { stability: 0.5, similarity_boost: 0.75 } })
    });
    if (!r.ok) return res.status(502).json({ error: 'voice error ' + r.status });
    const buf = Buffer.from(await r.arrayBuffer());
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(buf);
  } catch (e) {
    return res.status(502).json({ error: 'voice unavailable' });
  }
};
