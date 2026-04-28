import { ONBOARDING_QUESTIONS, STATES } from '../utils/constants.js';

export function OnboardingForm({ initial = {}, onComplete }) {
  const el = document.createElement('section');
  el.className = 'block reveal';
  el.id = 'onboarding-section';

  const state = { idx: 0, data: { ...initial } };

  el.innerHTML = `
    <div class="container">
      <h2 class="section-title">Tell us about your situation</h2>
      <p class="section-sub">Five quick questions. We’ll build your roadmap from your answers — no signup needed.</p>
      <div class="onboarding" id="ob-card"></div>
    </div>
  `;
  const card = el.querySelector('#ob-card');

  function render() {
    const q = ONBOARDING_QUESTIONS[state.idx];
    const total = ONBOARDING_QUESTIONS.length;
    const pct = Math.round(((state.idx) / total) * 100);

    let body = '';
    if (q.type === 'choice') {
      body = `<div class="options">${q.options.map(o => `
        <button class="option ${state.data[q.id] === o.value ? 'selected' : ''}" data-value="${o.value}">
          <span>${o.label}</span>
          <span class="check">${state.data[q.id] === o.value ? '✓' : ''}</span>
        </button>
      `).join('')}</div>`;
    } else if (q.type === 'select') {
      body = `<select class="select" id="state-select">
        <option value="">Select your state or UT…</option>
        ${STATES.map(s => `<option value="${s}" ${state.data[q.id] === s ? 'selected' : ''}>${s}</option>`).join('')}
      </select>`;
    }

    card.innerHTML = `
      <div class="progress-bar"><div class="fill" style="width:${pct}%"></div></div>
      <span class="step-counter">Step ${state.idx + 1} of ${total}</span>
      <div class="q-step">
        <h3>${q.title}</h3>
        <p>${q.sub}</p>
        ${body}
      </div>
      <div class="nav-row">
        <button class="btn-secondary" id="back-btn" ${state.idx === 0 ? 'disabled style="opacity:.4;cursor:not-allowed"' : ''}>← Back</button>
        <button class="btn-primary" id="next-btn">${state.idx === total - 1 ? 'Generate my roadmap' : 'Continue →'}</button>
      </div>
    `;

    if (q.type === 'choice') {
      card.querySelectorAll('.option').forEach(btn => {
        btn.addEventListener('click', () => {
          state.data[q.id] = btn.dataset.value;
          render();
        });
      });
    } else {
      card.querySelector('#state-select').addEventListener('change', (e) => {
        state.data[q.id] = e.target.value;
      });
    }

    card.querySelector('#back-btn').addEventListener('click', () => {
      if (state.idx > 0) { state.idx--; render(); }
    });
    card.querySelector('#next-btn').addEventListener('click', () => {
      const value = state.data[q.id];
      if (!value) {
        const target = card.querySelector(q.type === 'select' ? '.select' : '.options');
        target.style.transition = 'transform .15s';
        target.style.transform = 'translateX(-4px)';
        setTimeout(() => target.style.transform = 'translateX(4px)', 80);
        setTimeout(() => target.style.transform = 'translateX(0)', 160);
        return;
      }
      if (state.idx < ONBOARDING_QUESTIONS.length - 1) {
        state.idx++;
        render();
      } else {
        onComplete(state.data);
      }
    });
  }

  render();
  return el;
}
