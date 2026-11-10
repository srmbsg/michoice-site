// MiChoice SI chat assistant — Vercel serverless function.
// Answers ONLY from the site's own published content (api/kb.json, built from the site pages).
// Model: Google Gemini free tier (key read from GEMINI_API_KEY env var, set in the Vercel project).
const fs = require('fs');
const path = require('path');

let KB = null;
function loadKB() {
  if (KB) return KB;
  try {
    KB = JSON.parse(fs.readFileSync(path.join(__dirname, 'kb.json'), 'utf8'));
  } catch (e) {
    KB = { pages: {} };
  }
  return KB;
}

const STOP = new Set(('the a an and or of to in for on is are does do what which who how can i we you it its with from by at as be this that there their our your about into per over under any all more most other than then so if when where'.split(' ')));
function words(s) {
  return (s.toLowerCase().match(/[a-z0-9][a-z0-9\-']*/g) || []).filter(w => w.length > 2 && !STOP.has(w));
}
function chunksFor(page) {
  const parts = page.text.split(/(?<=[.!?])\s+(?=[A-Z0-9"“])/);
  const out = [];
  let cur = '';
  for (const p of parts) {
    if ((cur + ' ' + p).length > 700 && cur) { out.push(cur.trim()); cur = p; }
    else cur = cur ? cur + ' ' + p : p;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
function retrieve(query, k = 6) {
  const kb = loadKB();
  const qw = words(query);
  if (!qw.length) return [];
  const scored = [];
  for (const [name, page] of Object.entries(kb.pages)) {
    for (const chunk of chunksFor(page)) {
      const cw = new Set(words(chunk));
      let score = 0;
      for (const w of qw) { if (cw.has(w)) score += 1; if (chunk.toLowerCase().includes(w)) score += 0.5; }
      if (score > 0) scored.push({ score, file: page.file, title: page.title, text: chunk });
    }
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k);
}

const SYSTEM = `You are the MiChoice assistant on getmichoice.com, the website of MiChoice Technology Systems — K-12 school food service software. You are a SI (silicon intelligence) assistant, and you may say so plainly if asked what you are.

Answer rules:
- Answer ONLY from the SITE CONTENT provided below. If the content does not cover the question, say so plainly and point the visitor to the contact page (contactus.html) or the sales line 1.866.334.8257 / support line 1.281.517.0400.
- NEVER invent prices, contract terms, customer names, district counts, certifications, integrations, or features that are not in the content. MiChoice does not publish pricing on this site; if asked about price or cost, say pricing is quoted per district and offer the contact page or 1.866.334.8257.
- Keep answers short: 2-5 sentences unless the visitor asks for detail. Plain language, no hype.
- When a product page is relevant, end with a single line: More: <page file> (for example: More: inventorysoftware.html). One page only.
- If the visitor wants a demo, asks to buy, or wants a human, direct them to contactus.html (Request a Demo) or 1.866.334.8257.
- Current customers needing help: help desk 1.281.517.0400 or support@michoicetechnology.com.
- Company facts you may always use: MiChoice Technology Systems, Inc., 11210 Steeplecrest Drive, Ste 270, Houston, Texas 77065. Sales & demos 1.866.334.8257. Help desk 1.281.517.0400. Fax 1.866.334.1535. Email info@michoicetechnology.com / sales@michoicetechnology.com / support@michoicetechnology.com. Office hours 8:00 a.m.-5:00 p.m. CT, Mon-Fri. 35+ years in K-12 child nutrition, exclusively.`;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.getmichoice.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  const message = ((body && body.message) || '').toString().trim().slice(0, 1000);
  const history = Array.isArray(body && body.history) ? body.history.slice(-6) : [];
  if (!message) return res.status(400).json({ error: 'empty message' });

  const hits = retrieve(message + ' ' + history.map(h => h.text || '').join(' '));
  const context = hits.length
    ? hits.map(h => `[from ${h.file}]\n${h.text}`).join('\n\n')
    : '(no matching site content found)';

  const rawKey = process.env.GEMINI_API_KEY || '';
  const key = (rawKey.split(/\r?\n/).map(l => l.trim()).find(l => l.startsWith('AQ.')) || rawKey.trim());
  if (!key) return res.status(500).json({ error: 'assistant not configured' });

  const messages = [{ role: 'system', content: SYSTEM }];
  for (const h of history) {
    if (h && (h.role === 'user' || h.role === 'assistant') && h.text) messages.push({ role: h.role, content: String(h.text).slice(0, 1000) });
  }
  messages.push({ role: 'user', content: `SITE CONTENT:\n${context}\n\nVISITOR QUESTION: ${message}` });

  const MODELS = ['gemini-3.5-flash', 'gemini-3.8-flash'];
  let lastErr = null;
  for (const model of MODELS) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const r = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
          body: JSON.stringify({ model, messages, temperature: 0.3, max_tokens: 600 })
        });
        if (r.status === 503 || r.status === 429) { lastErr = new Error('busy ' + r.status); await new Promise(s2 => setTimeout(s2, 800)); continue; }
        if (!r.ok) { const eb = await r.text().catch(() => ''); lastErr = new Error('model error ' + r.status + ': ' + eb.slice(0, 200)); break; }
        const data = await r.json();
        const text = (((data.choices || [])[0] || {}).message || {}).content?.trim();
        if (text) return res.status(200).json({ reply: text, sources: [...new Set(hits.map(h => h.file))] });
        lastErr = new Error('empty reply');
      } catch (e) { lastErr = e; await new Promise(s2 => setTimeout(s2, 500)); }
    }
  }
  return res.status(502).json({ error: 'assistant busy, please try again', detail: String(lastErr && lastErr.message || '') });
};
