export function Hero({ onStart }) {
  const el = document.createElement('section');
  el.className = 'hero reveal';
  el.innerHTML = `
    <div class="hero-inner">
      <span class="eyebrow"><span class="pulse"></span> Built for Indian voters</span>
      <h1>Civic Sense<br/><span class="accent">Your Personal Guide to Voting in India</span></h1>
      <p class="lead">A step-by-step assistant that builds your personalized voting roadmap — from registration to election day — and connects you to official Election Commission resources.</p>
      <div class="cta-row">
        <button class="btn-primary" id="start-cta">
          Start My Voting Journey
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </button>
        <a href="#scenarios-section" class="btn-secondary">Pick a scenario</a>
      </div>
      <div class="hero-stats">
        <div><strong>6</strong>Personalized steps</div>
        <div><strong>100%</strong>Official resources</div>
        <div><strong>Free</strong>No signup required</div>
      </div>
    </div>
  `;
  el.querySelector('#start-cta').addEventListener('click', onStart);
  return el;
}
