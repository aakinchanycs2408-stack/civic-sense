import { StepCard } from './StepCard.js';
import { readinessPercent } from '../logic/roadmapGenerator.js';
import { ALERTS } from '../utils/constants.js';

export function Roadmap({ steps, user, onToggle, onOpenDetail, onReset }) {
  const el = document.createElement('section');
  el.className = 'block reveal';
  el.id = 'roadmap-section';
  el.style.background = 'linear-gradient(180deg, #FAFBFD 0%, #fff 100%)';

  const pct = readinessPercent(steps);
  const stateLine = user.state ? ` · ${user.state}` : '';

  el.innerHTML = `
    <div class="container">
      <div class="roadmap-header">
        <div>
          <h2 class="section-title">Your Voting Roadmap</h2>
          <p class="section-sub">Personalized for you${stateLine}. Tap any step for full instructions.</p>
          <button class="btn-ghost" id="reset-btn" style="margin-top:4px">↻ Restart questionnaire</button>
        </div>
        <div class="readiness">
          <div class="label">Readiness</div>
          <div class="value">
            ${pct}% ready to vote
            ${pct === 100 ? '<span style="display:inline-block; font-size: 32px; vertical-align: middle; margin-left: 8px; animation: reveal 0.5s ease;">🎉</span>' : ''}
          </div>
          <div class="bar"><div class="fill" style="width:${pct}%"></div></div>
        </div>
      </div>

      <div class="alerts">
        ${ALERTS.map(a => `
          <div class="alert">
            <span class="ico">⚠️</span>
            <div><h5>${a.title}</h5><p>${a.body}</p></div>
          </div>
        `).join('')}
      </div>

      <div class="timeline" id="timeline"></div>
    </div>
  `;

  const timeline = el.querySelector('#timeline');
  steps.forEach((s, i) => {
    timeline.appendChild(StepCard({ step: s, index: i, onToggle, onOpenDetail }));
  });

  el.querySelector('#reset-btn').addEventListener('click', onReset);

  return el;
}
