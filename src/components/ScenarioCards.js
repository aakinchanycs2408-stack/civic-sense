import { SCENARIOS } from '../utils/constants.js';

export function ScenarioCards({ onPick }) {
  const el = document.createElement('section');
  el.className = 'block reveal';
  el.id = 'scenarios-section';
  el.style.background = '#fff';
  el.style.borderTop = '1px solid var(--line)';
  el.style.borderBottom = '1px solid var(--line)';

  el.innerHTML = `
    <div class="container">
      <h2 class="section-title">Or jump straight to your situation</h2>
      <p class="section-sub">Pick a scenario and we’ll instantly tailor your roadmap.</p>
      <div class="scenarios">
        ${SCENARIOS.map(s => `
          <button class="scenario" data-id="${s.id}">
            <span class="ico">${s.icon}</span>
            <h4>${s.title}</h4>
            <p>${s.desc}</p>
          </button>
        `).join('')}
      </div>
    </div>
  `;

  el.querySelectorAll('.scenario').forEach(btn => {
    btn.addEventListener('click', () => {
      const sc = SCENARIOS.find(s => s.id === btn.dataset.id);
      onPick(sc);
    });
  });

  return el;
}
