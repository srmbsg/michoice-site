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
function retrieveFrom(kb, query, k = 7) {
  const qw = words(query);
  if (!qw.length) return [];
  const scored = [];
  for (const [name, page] of Object.entries(kb.pages)) {
    // A page whose title/file names the query term (e.g. a product name) is almost always the
    // authoritative page for that question — boost all of its chunks so generic pages that merely
    // mention the product in passing cannot crowd it out of the context.
    const titleText = ((page.title || '') + ' ' + (page.file || '')).toLowerCase();
    const titleHit = qw.some(w => titleText.includes(w));
    for (const chunk of chunksFor(page)) {
      const lc = chunk.toLowerCase();
      let score = 0;
      // Score by mention frequency (capped), not mere presence: the product's own page repeats
      // its name and vocabulary; a passing mention elsewhere must not tie with it.
      for (const w of qw) {
        const occ = lc.split(w).length - 1;
        if (occ > 0) score += Math.min(occ, 4) + 0.5;
      }
      if (score > 0) {
        if (titleHit) score += 2;
        scored.push({ score, file: page.file, title: page.title, text: chunk });
      }
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


let CARB_KB = null;
function loadCarbKB() {
  if (CARB_KB) return CARB_KB;
  try {
    CARB_KB = JSON.parse(fs.readFileSync(path.join(__dirname, 'kb-carborundum.json'), 'utf8'));
  } catch (e) {
    CARB_KB = { pages: {} };
  }
  return CARB_KB;
}

const SYSTEM_CARB = `You are the Carborundum AI assistant on carborundum.ai. You are a SI (silicon intelligence) assistant, and you may say so plainly if asked what you are. Carborundum AI builds AI operations software for local trades companies; its front door is SecondShift, an AI phone agent that answers a shop's phones at all hours.

Answer rules:
- Answer ONLY from the SITE CONTENT provided below and the standing facts in this prompt. If the content does not cover the question, say so plainly and point the visitor to info@carborundum.ai or the demo line (346) 220-4138.
- Standing facts you may always use: SecondShift's first month is FREE, then $59.99/month flat — no per-minute charges. Live demo line: (346) 220-4138 — call it and talk to SecondShift yourself. Carborundum AI contact: info@carborundum.ai. Signup starts at the intake page /secondshift/start on this site.
- Carborundum AI is ONE system described as four pillars — a single pipeline, not separate products: Ground Truth wins the transaction, Ground Work catches the move-in, Carbon runs the job, and everything lands in Silicon's CRM. If asked about the four pillars, name all four. Statuses: Ground Truth LIVE (real estate — gets in before the customer owns the parcel), Ground Work COMING SOON (catches the move-in; lists only Silicon shops with good reviews), Carbon LIVE, Silicon LIVE.
- Carbon is the app in the technician's hand out in the field. Sold standalone it is simply "Carbon"; in the overall picture it is a field-tech extension of Silicon, working in the field below Silicon or below a competitor's back-office software such as ServiceTitan. Carbon is LIVE — never call it "in progress" or "in development", and never say you have no information about it.
- Silicon is the back office: the CRM and system of record everything lands in. Inside the Silicon suite, SecondShift is the person at the desk at all hours (standalone, it is the after-hours phone agent). Silicon is LIVE — never call it "in progress" or "in development", and never say you have no information about it.
- Pricing for Carbon, Silicon, and the full suite is not published here — never invent a price for them; point the visitor to info@carborundum.ai or the demo line.
- NEVER invent prices beyond the standing facts, customer names, results, or features that are not in the content.
- Keep answers short: 2-5 sentences unless the visitor asks for detail. Plain language, no hype.
- When a site page is relevant, end with a single line: More: <page path> (for example: More: /pillars). One page only.
- If the visitor wants to buy or talk to a human, direct them to /secondshift/start or info@carborundum.ai.`;

module.exports = async (req, res) => {
  const ORIGINS = ['https://www.getmichoice.com', 'https://getmichoice.com', 'https://www.carborundum.ai', 'https://carborundum.ai'];
  const origin = req.headers.origin || '';
  res.setHeader('Access-Control-Allow-Origin', ORIGINS.includes(origin) ? origin : 'https://www.getmichoice.com');
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  const message = ((body && body.message) || '').toString().trim().slice(0, 1000);
  const site = ((body && body.site) || '').toString() === 'carborundum' ? 'carborundum' : 'michoice';
  const history = Array.isArray(body && body.history) ? body.history.slice(-6) : [];
  if (!message) return res.status(400).json({ error: 'empty message' });

  const activeKB = site === 'carborundum' ? loadCarbKB() : loadKB();
  const hits = retrieveFrom(activeKB, message + ' ' + history.map(h => h.text || '').join(' '));
  const context = hits.length
    ? hits.map(h => `[from ${h.file}]\n${h.text}`).join('\n\n')
    : '(no matching site content found)';

  const rawKey = process.env.GEMINI_API_KEY || '';
  const key = (rawKey.split(/\r?\n/).map(l => l.trim()).find(l => l.startsWith('AQ.')) || rawKey.trim());
  if (!key) return res.status(500).json({ error: 'assistant not configured' });

  const messages = [{ role: 'system', content: site === 'carborundum' ? SYSTEM_CARB : SYSTEM }];
  for (const h of history) {
    if (h && (h.role === 'user' || h.role === 'assistant') && h.text) messages.push({ role: h.role, content: String(h.text).slice(0, 1000) });
  }
  messages.push({ role: 'user', content: `SITE CONTENT:\n${context}\n\nVISITOR QUESTION: ${message}` });

  // A reply that stops mid-sentence (no terminal punctuation once any trailing "More:" line is
  // removed) is a truncated generation, not an answer — retry rather than ship half a sentence.
  const looksTruncated = (t) => {
    if (!t) return true;
    const bodyTxt = t.replace(/\s*More:\s*\S+\s*$/, '').trim();
    return !/[.!?\u2026]["'\u201d\u2019)]?$/.test(bodyTxt);
  };

  const MODELS = ['gemini-3.5-flash', 'gemini-3.8-flash'];
  let lastErr = null;
  let bestText = null;
  for (const model of MODELS) {
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        // Retries get a concision nudge so a re-roll finishes inside the token budget instead of
        // truncating again. max_tokens is generous because these Gemini models spend part of the
        // budget on reasoning tokens before any visible answer appears.
        const msgs = attempt === 0 ? messages : messages.concat([{ role: 'system', content: 'Keep the answer complete but concise: 2-4 full sentences. Always finish your final sentence, and end with the More: line when a page is relevant.' }]);
        const r = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
          body: JSON.stringify({ model, messages: msgs, temperature: 0.3, max_tokens: 1600 })
        });
        if (r.status === 503 || r.status === 429) { lastErr = new Error('busy ' + r.status); await new Promise(s2 => setTimeout(s2, 1200)); continue; }
        if (!r.ok) { const eb = await r.text().catch(() => ''); lastErr = new Error('model error ' + r.status + ': ' + eb.slice(0, 200)); break; }
        const data = await r.json();
        const text = (((data.choices || [])[0] || {}).message || {}).content?.trim();
        if (text) {
          if (!looksTruncated(text)) return res.status(200).json({ reply: text, sources: [...new Set(hits.map(h => h.file))] });
          if (!bestText || text.length > bestText.length) bestText = text;
          lastErr = new Error('truncated reply');
          await new Promise(s2 => setTimeout(s2, 400));
          continue;
        }
        lastErr = new Error('empty reply');
      } catch (e) { lastErr = e; await new Promise(s2 => setTimeout(s2, 500)); }
    }
  }
  if (bestText) return res.status(200).json({ reply: bestText, sources: [...new Set(hits.map(h => h.file))] });
  return res.status(502).json({ error: 'assistant busy, please try again', detail: String(lastErr && lastErr.message || '') });
};
