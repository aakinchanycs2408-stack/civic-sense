export default function StepCard({ step, index, onToggle, onOpenDetail }) {
  const el = document.createElement('div');
  el.className = `step-card ${step.status} reveal`;
  el.style.animationDelay = `${index * 60}ms`;

  const badgeText = step.status === 'completed' ? 'Done'
                  : step.status === 'next' ? 'Next up' : 'Pending';

  el.innerHTML = `
    <span class="pin">${step.status === 'completed' ? '✓' : index + 1}</span>
    <div class="head">
      <h4>${step.title}</h4>
      <span class="badge ${step.status}">${badgeText}</span>
    </div>
    <p class="desc">${step.description}</p>
    <div class="why"><strong>Why this matters: </strong>${step.why}</div>
    <div class="skip"><strong>If you skip this: </strong>${step.skip}</div>
    <div class="actions">
      ${step.actions.map(a => `
        <a class="btn-action ${a.primary ? '' : 'alt'}" href="${a.url}" target="_blank" rel="noopener noreferrer">
          ${a.label}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M7 7h10v10"/></svg>
        </a>
      `).join('')}
      <button class="btn-action detail" data-action="detail">View details & FAQs</button>
    </div>
    <label class="checkbox-toggle">
      <input type="checkbox" ${step.status === 'completed' ? 'checked' : ''} />
      Mark this step as completed
    </label>
  `;

  el.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
    onToggle(step.id, e.target.checked);
  });
  el.querySelector('[data-action="detail"]').addEventListener('click', () => onOpenDetail(step));

  return el;
}
