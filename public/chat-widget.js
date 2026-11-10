/* MiChoice SI chat assistant widget — self-contained, no dependencies.
   Voice: ElevenLabs TTS via /api/tts (Matilda — MiChoice walkthrough voice). Toggle in header. */
(function () {
  var BASE = (function () { var s = document.currentScript; if (s && s.src) { try { return new URL('.', s.src).href.replace(/\/$/, ''); } catch (e) {} } return ''; })();
  var API = BASE + '/api/chat';
  var TTS = BASE + '/api/tts';
  var history = [];
  var SITE = window.MC_CHAT_SITE === 'carborundum' ? 'carborundum' : 'michoice';
  var voiceOn = false;
  var audio = null;

  var css = '\
#mc-chat-btn{position:fixed;right:20px;bottom:20px;z-index:9998;background:#2563eb;color:#fff;border:none;border-radius:999px;padding:.8rem 1.2rem;font:600 .92rem -apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.45);display:flex;align-items:center;gap:.5rem}\
#mc-chat-btn:hover{background:#1d4ed8}\
#mc-chat-panel{position:fixed;right:20px;bottom:84px;z-index:9999;width:min(380px,calc(100vw - 32px));height:min(560px,calc(100vh - 120px));background:#111111;border:1px solid #2a2a2a;border-radius:14px;display:none;flex-direction:column;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.6);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif}\
#mc-chat-panel.open{display:flex}\
.mc-head{background:#141414;border-bottom:1px solid #2a2a2a;padding:.8rem 1rem;display:flex;align-items:center;gap:.6rem}\
.mc-head .mc-title{color:#f5f5f5;font-weight:700;font-size:.95rem;flex:1}\
.mc-head .mc-sub{color:#6b7280;font-size:.72rem;font-weight:400;display:block}\
.mc-vbtn{background:#1a1a1a;border:1px solid #2a2a2a;color:#a3a3a3;border-radius:999px;padding:.32rem .7rem;font-size:.75rem;font-weight:600;cursor:pointer}\
.mc-vbtn.on{background:#2563eb;border-color:#2563eb;color:#fff}\
.mc-x{background:none;border:none;color:#a3a3a3;font-size:1.2rem;cursor:pointer;line-height:1}\
#mc-msgs{flex:1;overflow-y:auto;padding:1rem;display:flex;flex-direction:column;gap:.6rem;background:#0a0a0a}\
.mc-msg{max-width:88%;padding:.6rem .8rem;border-radius:12px;font-size:.88rem;line-height:1.5;white-space:pre-wrap;word-wrap:break-word}\
.mc-msg.bot{background:#1a1a1a;color:#f5f5f5;border:1px solid #2a2a2a;align-self:flex-start;border-bottom-left-radius:4px}\
.mc-msg.user{background:#2563eb;color:#fff;align-self:flex-end;border-bottom-right-radius:4px}\
.mc-msg a{color:#93c5fd}\
.mc-typing{color:#6b7280;font-size:.8rem;font-style:italic;align-self:flex-start}\
.mc-chips{display:flex;flex-wrap:wrap;gap:.4rem;padding:.55rem 1rem;background:#0a0a0a;border-top:1px solid #1f1f1f}\
.mc-chip{background:#141414;border:1px solid #2a2a2a;color:#a3a3a3;border-radius:999px;padding:.3rem .65rem;font-size:.74rem;cursor:pointer}\
.mc-chip:hover{border-color:#3b82f6;color:#f5f5f5}\
.mc-form{display:flex;gap:.5rem;padding:.7rem;border-top:1px solid #2a2a2a;background:#111111}\
#mc-input{flex:1;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;color:#f5f5f5;padding:.55rem .7rem;font-size:.88rem;outline:none}\
#mc-input:focus{border-color:#3b82f6}\
#mc-send{background:#2563eb;color:#fff;border:none;border-radius:8px;padding:.55rem .95rem;font-weight:700;cursor:pointer}\
#mc-send:disabled{opacity:.5;cursor:default}\
@media (max-width:480px){#mc-chat-panel{right:8px;bottom:76px}#mc-chat-btn{right:12px;bottom:12px}}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var btn = document.createElement('button');
  btn.id = 'mc-chat-btn';
  btn.innerHTML = '<span aria-hidden="true">💬</span> Ask MiChoice';
  btn.setAttribute('aria-label', 'Open the MiChoice chat assistant');

  var panel = document.createElement('div');
  panel.id = 'mc-chat-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'MiChoice chat assistant');
  panel.innerHTML =
    '<div class="mc-head"><div class="mc-title">MiChoice Assistant<span class="mc-sub">A SI assistant — answers from this site</span></div>' +
    '<button class="mc-vbtn" id="mc-voice" aria-pressed="false" title="Hear replies read aloud">🔇 Voice off</button>' +
    '<button class="mc-x" id="mc-close" aria-label="Close chat">×</button></div>' +
    '<div id="mc-msgs"></div>' +
    '<div class="mc-chips" id="mc-chips"></div>' +
    '<form class="mc-form" id="mc-form"><input id="mc-input" type="text" placeholder="Ask about MiChoice…" autocomplete="off" maxlength="1000"><button id="mc-send" type="submit">Send</button></form>';

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  var msgs = panel.querySelector('#mc-msgs');
  var chips = panel.querySelector('#mc-chips');
  var input = panel.querySelector('#mc-input');
  var sendBtn = panel.querySelector('#mc-send');
  var voiceBtn = panel.querySelector('#mc-voice');
  var greeted = false;

  ['What does the POS do?', 'How do F&R applications work?', 'How do parents pay online?', 'What are your support hours?', 'Request a demo'].forEach(function (q) {
    var c = document.createElement('button');
    c.className = 'mc-chip'; c.type = 'button'; c.textContent = q;
    c.addEventListener('click', function () { input.value = q; form.requestSubmit(); });
    chips.appendChild(c);
  });

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function linkify(el, text) {
    el.innerHTML = esc(text)
      .replace(/([a-z0-9_\-]+\.html)/gi, '<a href="/$1">$1</a>')
      .replace(/(^|\s)(\/[a-z0-9_\-\/]+)/g, '$1<a href="$2">$2</a>');
  }
  function addMsg(text, who) {
    var d = document.createElement('div');
    d.className = 'mc-msg ' + who;
    if (who === 'bot') linkify(d, text); else d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }
  function speak(text) {
    if (!voiceOn) return;
    var clean = text.replace(/More:\s*\S+/g, '').slice(0, 800);
    fetch(TTS, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: clean, site: SITE }) })
      .then(function (r) { if (!r.ok) throw new Error('tts'); return r.blob(); })
      .then(function (b) {
        if (audio) { audio.pause(); }
        audio = new Audio(URL.createObjectURL(b));
        audio.play().catch(function () {});
      })
      .catch(function () {});
  }
  voiceBtn.addEventListener('click', function () {
    voiceOn = !voiceOn;
    voiceBtn.classList.toggle('on', voiceOn);
    voiceBtn.setAttribute('aria-pressed', String(voiceOn));
    voiceBtn.textContent = voiceOn ? '🔊 Voice on' : '🔇 Voice off';
    if (!voiceOn && audio) audio.pause();
  });

  function openPanel() {
    panel.classList.add('open');
    if (!greeted) {
      greeted = true;
      addMsg('Hello — I\'m the MiChoice assistant, a SI (silicon intelligence) here on the site. Ask me about our K-12 food service software — POS, central office, free & reduced, inventory, parent payments — or type "demo" and I\'ll point you to a real person.', 'bot');
    }
    input.focus();
  }
  btn.addEventListener('click', function () {
    panel.classList.contains('open') ? panel.classList.remove('open') : openPanel();
  });
  panel.querySelector('#mc-close').addEventListener('click', function () { panel.classList.remove('open'); });

  var form = panel.querySelector('#mc-form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) return;
    input.value = '';
    addMsg(text, 'user');
    history.push({ role: 'user', text: text });
    var typing = document.createElement('div');
    typing.className = 'mc-typing'; typing.textContent = 'Thinking…';
    msgs.appendChild(typing); msgs.scrollTop = msgs.scrollHeight;
    sendBtn.disabled = true;
    fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text, history: history.slice(0, -1), site: SITE }) })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (out) {
        typing.remove();
        var reply = out.ok && out.j.reply ? out.j.reply : 'Sorry — I hit a snag. You can reach a real person at 1.866.334.8257, or through the contact page (contactus.html).';
        reply = reply.replace(/More:\s*([a-z0-9\-]+)(?:\.html)?\s*$/i, 'More: $1.html');
        addMsg(reply, 'bot');
        history.push({ role: 'assistant', text: reply });
        speak(reply);
      })
      .catch(function () {
        typing.remove();
        addMsg('Sorry — I couldn\'t connect just now. You can reach a real person at 1.866.334.8257, or through the contact page (contactus.html).', 'bot');
      })
      .finally(function () { sendBtn.disabled = false; input.focus(); });
  });
})();
