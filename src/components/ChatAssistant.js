import { STORAGE_KEYS } from '../utils/constants.js';

const SUGGESTIONS = [
  'How do I register to vote in India?',
  'What documents do I need on election day?',
  'How do I find my polling booth?',
  'What is Form 8 used for?',
];

const SYSTEM_PROMPT = `You are Civic Sense, a friendly assistant focused exclusively on the Indian electoral process.
Help users with: voter registration (Form 6), Voter ID / EPIC, address transfer (Form 8),
electoral rolls, polling booth location, and election day procedure.
Cite official sources where possible (Election Commission of India — eci.gov.in, voters.eci.gov.in, NVSP).
Keep answers short, clear, and actionable. If a question is not about Indian elections, politely redirect.`;

export default function ChatAssistant() {
  let section = document.getElementById('assistant-section');
  if (!section) {
    section = document.createElement('section');
    section.id = 'assistant-section';
    section.className = 'assistant-section';
    document.body.appendChild(section);
  }

  let panel = document.getElementById('chat-panel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'chat-panel';
    panel.className = 'chat-panel';
    section.appendChild(panel);
  }
  panel.innerHTML = '';

  const state = {
    messages: [
      { role: 'bot', text: 'Namaste! I’m your Civic Sense assistant. Ask me anything about voting in India — registration, Voter ID, polling booth, or election day.' },
    ],
    loading: false,
  };

  const wrap = document.createElement('div');
  wrap.style.display = 'flex';
  wrap.style.flexDirection = 'column';
  wrap.style.height = '100%';
  wrap.innerHTML = `
    <div class="chat-head">
      <div>
        <h4>Civic Sense Assistant</h4>
        <small>Powered by Gemini · Indian elections only</small>
      </div>
      <button id="close-chat">×</button>
    </div>
    <div class="chat-body" id="chat-body"></div>
    <div class="suggestions" id="suggestions"></div>
    <form class="chat-input-row" id="chat-form">
      <input type="text" id="chat-input" placeholder="Ask about voting in India…" autocomplete="off" />
      <button type="submit" id="send-btn">Send</button>
    </form>
  `;
  panel.appendChild(wrap);

  const body = wrap.querySelector('#chat-body');
  const sugWrap = wrap.querySelector('#suggestions');
  const input = wrap.querySelector('#chat-input');
  const sendBtn = wrap.querySelector('#send-btn');

  function renderMessages() {
    body.innerHTML = state.messages.map(m => {
      if (m.role === 'typing') {
        return `<div class="msg bot"><div class="typing"><span></span><span></span><span></span></div></div>`;
      }
      return `<div class="msg ${m.role}">${escapeHtml(m.text).replace(/\n/g, '<br/>')}</div>`;
    }).join('');
    body.scrollTop = body.scrollHeight;
  }
  function renderSuggestions() {
    sugWrap.innerHTML = SUGGESTIONS.map(s => `<button class="suggestion" type="button">${s}</button>`).join('');
    sugWrap.querySelectorAll('.suggestion').forEach(b => {
      b.addEventListener('click', () => {
        input.value = b.textContent;
        input.focus();
      });
    });
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  }

  async function sendMessage(text) {
    if (!text.trim() || state.loading) return;

    state.messages.push({ role: 'user', text });
    state.messages.push({ role: 'typing' });
    state.loading = true;
    sendBtn.disabled = true;
    renderMessages();

    try {
      const reply = await callGemini(state.messages.filter(m => m.role !== 'typing' && m.role !== 'system'));
      state.messages = state.messages.filter(m => m.role !== 'typing');
      state.messages.push({ role: 'bot', text: reply });
    } catch (err) {
      state.messages = state.messages.filter(m => m.role !== 'typing');
      state.messages.push({ role: 'system', text: `Error: ${err.message}. Check your API key and try again.` });
    } finally {
      state.loading = false;
      sendBtn.disabled = false;
      renderMessages();
    }
  }

  // events
  wrap.querySelector('#close-chat').addEventListener('click', () => panel.classList.remove('open'));

  wrap.querySelector('#chat-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value;
    input.value = '';
    sendMessage(v);
  });

  renderMessages();
  renderSuggestions();
}

async function callGemini(messages) {
  // Convert to Gemini "contents" format
  const contents = messages.map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }],
  }));

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { role: 'system', parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: { temperature: 0.5, maxOutputTokens: 800 },
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Server Error ${res.status}`);
  }
  
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from server');
  return text.trim();
}
