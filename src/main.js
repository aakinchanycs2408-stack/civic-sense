import Hero from './components/Hero.js';
import OnboardingForm from './components/OnboardingForm.js';
import ScenarioCards from './components/ScenarioCards.js';
import Roadmap from './components/Roadmap.js';
import ChatAssistant from './components/ChatAssistant.js';
import { generateRoadmap, applyProgress } from './logic/roadmapGenerator.js';
import { STORAGE_KEYS } from './utils/constants.js';

const app = document.getElementById('app');

const state = {
  user: loadJSON(STORAGE_KEYS.user) || null,
  completed: loadJSON(STORAGE_KEYS.progress) || [],
};

function loadJSON(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function render() {
  app.innerHTML = '';

  // Hero (always visible at top)
  app.appendChild(Hero({ onStart: () => {
    document.getElementById('onboarding-section')?.scrollIntoView({ behavior: 'smooth' });
  }}));

  // Scenario quick-picks
  app.appendChild(ScenarioCards({ onPick: (sc) => {
    state.user = { ...sc.preset, state: state.user?.state || '' };
    state.completed = [];
    saveJSON(STORAGE_KEYS.user, state.user);
    saveJSON(STORAGE_KEYS.progress, state.completed);
    render();
    setTimeout(() => document.getElementById('roadmap-section')?.scrollIntoView({ behavior: 'smooth' }), 80);
  }}));

  if (!state.user) {
    // Onboarding
    app.appendChild(OnboardingForm({
      onComplete: (data) => {
        state.user = data;
        state.completed = [];
        saveJSON(STORAGE_KEYS.user, data);
        saveJSON(STORAGE_KEYS.progress, []);
        render();
        setTimeout(() => document.getElementById('roadmap-section')?.scrollIntoView({ behavior: 'smooth' }), 80);
      }
    }));
  } else {
    // Roadmap
    const baseSteps = generateRoadmap(state.user);
    const steps = applyProgress(baseSteps, state.completed);
    app.appendChild(Roadmap({
      steps,
      user: state.user,
      onToggle: (id, checked) => {
        const was100 = state.completed.length === baseSteps.length && baseSteps.length > 0;
        const set = new Set(state.completed);
        if (checked) set.add(id); else set.delete(id);
        state.completed = [...set];
        const is100 = state.completed.length === baseSteps.length && baseSteps.length > 0;
        
        saveJSON(STORAGE_KEYS.progress, state.completed);
        render();

        if (!was100 && is100) {
          triggerCelebration();
        }
      },
      onOpenDetail: openDetailModal,
      onReset: () => {
        state.user = null;
        state.completed = [];
        localStorage.removeItem(STORAGE_KEYS.user);
        localStorage.removeItem(STORAGE_KEYS.progress);
        render();
      },
    }));
  }
}

function openDetailModal(step) {
  let root = document.getElementById('modal-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'modal-root';
    document.body.appendChild(root);
  }
  root.innerHTML = `
    <div class="modal-backdrop" id="backdrop">
      <div class="modal" role="dialog" aria-modal="true">
        <div class="modal-head">
          <h3>${step.title}</h3>
          <button class="modal-close" id="close-modal">×</button>
        </div>
        <div class="modal-body">
          <h4>Overview</h4>
          <p style="margin:0;color:var(--muted);font-size:14px">${step.detail.explanation}</p>

          <h4>How to complete</h4>
          <ol>${step.detail.howTo.map(s => `<li>${s}</li>`).join('')}</ol>

          <h4>Required documents</h4>
          <ul>${step.detail.documents.map(d => `<li>${d}</li>`).join('')}</ul>

          <h4>FAQs</h4>
          <div>${step.detail.faqs.map(f => `
            <div class="faq-item"><strong>${f.q}</strong><span>${f.a}</span></div>
          `).join('')}</div>

          <div style="margin-top:22px;display:flex;flex-wrap:wrap;gap:8px">
            ${step.actions.map(a => `
              <a class="btn-action ${a.primary ? '' : 'alt'}" href="${a.url}" target="_blank" rel="noopener noreferrer">
                ${a.label} ↗
              </a>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
  const close = () => { root.innerHTML = ''; };
  root.querySelector('#close-modal').addEventListener('click', close);
  root.querySelector('#backdrop').addEventListener('click', (e) => {
    if (e.target.id === 'backdrop') close();
  });
}

function triggerCelebration() {
  const overlay = document.createElement('div');
  overlay.className = 'celebration-overlay';
  overlay.innerHTML = '🎉';
  document.body.appendChild(overlay);
  setTimeout(() => {
    if (document.body.contains(overlay)) {
      overlay.remove();
    }
  }, 3500);
}

// ---- Chat ----
ChatAssistant();
const chatPanel = document.getElementById('chat-panel');
const assistantSection = document.getElementById('assistant-section');
function toggleChat() {
  if (assistantSection && chatPanel) {
    assistantSection.scrollIntoView({ behavior: 'smooth' });
    const input = chatPanel.querySelector('input');
    if (input) setTimeout(() => input.focus(), 500);
  }
}
const fab = document.getElementById('chat-fab');
if (fab) fab.addEventListener('click', toggleChat);
const openChatBtn = document.getElementById('open-chat-btn');
if (openChatBtn) openChatBtn.addEventListener('click', toggleChat);

// ---- boot ----
render();
