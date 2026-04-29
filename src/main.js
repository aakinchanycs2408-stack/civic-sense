
/* --- src/utils/constants.js --- */
// Official Indian government election resources
const LINKS = {
  nvsp: 'https://www.nvsp.in/',
  voterPortal: 'https://voters.eci.gov.in/',
  registerForm6: 'https://voters.eci.gov.in/signup',
  electoralRoll: 'https://electoralsearch.eci.gov.in/',
  pollingBooth: 'https://electoralsearch.eci.gov.in/pollingstation',
  voterIdDownload: 'https://voters.eci.gov.in/download-eepic',
  transferForm8: 'https://voters.eci.gov.in/login?returnUrl=%2Fform8',
  voterHelpline: 'https://play.google.com/store/apps/details?id=com.eci.citizen',
  eci: 'https://www.eci.gov.in/',
};

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra',
  'Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu',
  'Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi (NCT)','Jammu & Kashmir','Ladakh','Puducherry','Chandigarh','Andaman & Nicobar Islands',
  'Dadra & Nagar Haveli and Daman & Diu','Lakshadweep'
];

const STORAGE_KEYS = {
  user: 'civic_sense_user',
  progress: 'civic_sense_progress',
  apiKey: 'civic_sense_gemini_key',
};

const ONBOARDING_QUESTIONS = [
  {
    id: 'firstTime',
    title: 'Are you a first-time voter?',
    sub: 'This helps us prioritize the right starting point for you.',
    type: 'choice',
    options: [
      { value: 'yes', label: 'Yes, this is my first election' },
      { value: 'no',  label: 'No, I have voted before' },
    ],
  },
  {
    id: 'registered',
    title: 'Are you registered on the electoral roll?',
    sub: 'Only registered voters can cast a vote in India.',
    type: 'choice',
    options: [
      { value: 'yes',     label: 'Yes, I am registered' },
      { value: 'no',      label: 'No, I am not registered' },
      { value: 'unsure',  label: 'I am not sure' },
    ],
  },
  {
    id: 'hasVoterId',
    title: 'Do you have a Voter ID (EPIC)?',
    sub: 'EPIC stands for Elector Photo Identity Card.',
    type: 'choice',
    options: [
      { value: 'yes', label: 'Yes, I have my Voter ID' },
      { value: 'no',  label: 'No, I need one' },
    ],
  },
  {
    id: 'changedCity',
    title: 'Have you changed your city recently?',
    sub: 'If yes, you may need to transfer your constituency.',
    type: 'choice',
    options: [
      { value: 'yes', label: 'Yes, I moved' },
      { value: 'no',  label: 'No, same address' },
    ],
  },
  {
    id: 'state',
    title: 'Which state do you live in?',
    sub: 'We use this to give location-specific guidance.',
    type: 'select',
  },
];

const SCENARIOS = [
  {
    id: 'first',
    icon: '🗳️',
    title: 'First-time voter',
    desc: 'You just turned 18 or are voting for the first time.',
    preset: { firstTime: 'yes', registered: 'no', hasVoterId: 'no', changedCity: 'no' },
  },
  {
    id: 'unregistered',
    icon: '📝',
    title: 'Not registered',
    desc: 'You have never registered on the electoral roll.',
    preset: { firstTime: 'no', registered: 'no', hasVoterId: 'no', changedCity: 'no' },
  },
  {
    id: 'moved',
    icon: '🏙️',
    title: 'Changed city',
    desc: 'You moved to a new constituency and need to update.',
    preset: { firstTime: 'no', registered: 'yes', hasVoterId: 'yes', changedCity: 'yes' },
  },
  {
    id: 'lost',
    icon: '🪪',
    title: 'Lost Voter ID',
    desc: 'You misplaced your EPIC and need a duplicate.',
    preset: { firstTime: 'no', registered: 'yes', hasVoterId: 'no', changedCity: 'no' },
  },
];

const ALERTS = [
  {
    id: 'reg-deadline',
    title: 'Registration deadlines move fast',
    body: 'Voter rolls typically close ~10 days before an election notification. Register early to avoid missing out.',
  },
];


/* --- src/logic/roadmapGenerator.js --- */

/**
 * Generates a personalized voting roadmap based on the user's situation.
 * @param {object} user - { firstTime, registered, hasVoterId, changedCity, state }
 * @returns {Array<Step>}
 */
function generateRoadmap(user = {}) {
  const steps = [];

  // 1. Register if not registered or unsure
  if (user.registered === 'no' || user.registered === 'unsure') {
    steps.push({
      id: 'register',
      title: 'Register to Vote (Form 6)',
      description: 'Add your name to the electoral roll of your constituency. Required for every voter.',
      why: 'Without being on the electoral roll, you legally cannot cast a vote — even if you have a Voter ID.',
      skip: 'If you don’t register, your name will not appear at the polling booth and you cannot vote.',
      actions: [
        { label: 'Register on Voters Portal', url: LINKS.registerForm6, primary: true },
        { label: 'NVSP', url: LINKS.nvsp },
      ],
      detail: {
        explanation: 'Form 6 is used to enroll new electors. Submit it online via the Election Commission’s Voters’ Service Portal.',
        howTo: [
          'Sign up on voters.eci.gov.in with your mobile number.',
          'Select “New Voter Registration (Form 6)”.',
          'Fill personal details, address, and upload documents.',
          'Submit and note the reference ID for tracking.',
        ],
        documents: [
          'Recent passport-size photograph',
          'Age proof (Aadhaar, PAN, school certificate, or birth certificate)',
          'Address proof (Aadhaar, utility bill, passport, or rental agreement)',
        ],
        faqs: [
          { q: 'When can I register?', a: 'You can register any time, but the roll closes shortly before each election. Apply early.' },
          { q: 'How long does it take?', a: 'Verification usually takes 2–4 weeks. You can track your status on the Voters portal.' },
        ],
      },
    });
  }

  // 2. Apply for / re-issue Voter ID
  if (user.hasVoterId === 'no') {
    steps.push({
      id: 'voter-id',
      title: 'Apply for Voter ID (EPIC)',
      description: 'Get your Elector Photo Identity Card — your official voting document.',
      why: 'EPIC is the most widely accepted ID at polling booths and proves you are an enrolled elector.',
      skip: 'Without EPIC you can still vote using alternate IDs (Aadhaar, passport), but you risk delays and verification issues.',
      actions: [
        { label: 'Download e-EPIC', url: LINKS.voterIdDownload, primary: true },
        { label: 'Voters Portal', url: LINKS.voterPortal },
      ],
      detail: {
        explanation: 'Once your Form 6 is approved, you receive an EPIC number. The digital e-EPIC can be downloaded as a secure PDF.',
        howTo: [
          'Log in at voters.eci.gov.in.',
          'Go to “Download e-EPIC”.',
          'Enter your EPIC number or reference ID.',
          'Verify via OTP and download the PDF.',
        ],
        documents: ['Registered mobile number linked to your EPIC.'],
        faqs: [
          { q: 'Is e-EPIC valid?', a: 'Yes, e-EPIC is legally valid and accepted at polling booths.' },
          { q: 'I lost my physical card.', a: 'You can download e-EPIC anytime, or apply for a duplicate via Form-001.' },
        ],
      },
    });
  }

  // 3. Transfer constituency if changed city
  if (user.changedCity === 'yes') {
    steps.push({
      id: 'transfer',
      title: 'Update Address / Transfer Constituency',
      description: 'Move your registration to your new address using Form 8.',
      why: 'You can only vote at your registered constituency. Voting elsewhere is not permitted.',
      skip: 'If you don’t transfer, you’ll have to travel back to your old constituency to vote — or lose your vote.',
      actions: [
        { label: 'File Form 8 (Transfer)', url: LINKS.transferForm8, primary: true },
        { label: 'Search Roll', url: LINKS.electoralRoll },
      ],
      detail: {
        explanation: 'Form 8 handles correction, replacement, and shifting of address within or across constituencies.',
        howTo: [
          'Log in at voters.eci.gov.in.',
          'Choose “Shifting of Residence (Form 8)”.',
          'Select self / family member.',
          'Enter the new address and upload proof.',
        ],
        documents: ['New address proof (Aadhaar, utility bill, rent agreement)', 'EPIC number'],
        faqs: [
          { q: 'How long does transfer take?', a: 'Typically 2–4 weeks. Your old entry will be deleted automatically once the new one is approved.' },
        ],
      },
    });
  }

  // 4. ALWAYS — verify details
  steps.push({
    id: 'verify',
    title: 'Verify Your Voter Details',
    description: 'Confirm your name appears correctly in the electoral roll for your constituency.',
    why: 'Even registered voters can be marked absent or have name spelling errors. Verify before election day.',
    skip: 'Skipping this risks discovering on election day that your name isn’t on the roll — too late to fix.',
    actions: [
      { label: 'Check Electoral Roll', url: LINKS.electoralRoll, primary: true },
    ],
    detail: {
      explanation: 'The Electoral Search portal lets you find your name by EPIC number, name, or details.',
      howTo: [
        'Open electoralsearch.eci.gov.in.',
        'Search using EPIC number for fastest result.',
        'Verify name, age, address, and constituency.',
        'If anything is wrong, file Form 8 for correction.',
      ],
      documents: ['EPIC number (recommended)'],
      faqs: [
        { q: 'I can’t find my name.', a: 'Try search by details, or check the state CEO website. If still missing, register via Form 6.' },
      ],
    },
  });

  // 5. ALWAYS — find polling booth
  steps.push({
    id: 'booth',
    title: 'Find Your Polling Booth',
    description: 'Locate your assigned polling station and serial number on the roll.',
    why: 'You can only vote at the polling booth assigned to your address.',
    skip: 'Without knowing your booth, you may waste hours on election day or end up in the wrong location.',
    actions: [
      { label: 'Polling Booth Finder', url: LINKS.pollingBooth, primary: true },
      { label: 'Voter Helpline App', url: LINKS.voterHelpline },
    ],
    detail: {
      explanation: 'The ECI Polling Station search tool maps your EPIC to your assigned booth and serial number.',
      howTo: [
        'Open the Polling Station search.',
        'Enter your EPIC or personal details.',
        'Note the booth address, serial number, and part number.',
        'Save a screenshot for election day.',
      ],
      documents: ['EPIC number'],
      faqs: [
        { q: 'Can I vote at any booth?', a: 'No — you must vote at the booth assigned to your address.' },
      ],
    },
  });

  // 6. ALWAYS — election day prep
  steps.push({
    id: 'election-day',
    title: 'Election Day Preparation',
    description: 'Plan your visit, carry the right documents, and know your rights.',
    why: 'Being prepared ensures you cast your vote quickly and confidently.',
    skip: 'Without preparation you may face long queues, missing IDs, or end up not voting.',
    actions: [
      { label: 'ECI Official Site', url: LINKS.eci, primary: true },
    ],
    detail: {
      explanation: 'Polling typically runs 7 AM to 6 PM. Check your state’s notification for exact timings.',
      howTo: [
        'Carry EPIC or one accepted alternate ID (Aadhaar, passport, driving licence, etc.).',
        'Arrive early to avoid mid-day queues.',
        'Switch off your phone inside the booth.',
        'Verify the EVM display shows your vote, then confirm via VVPAT slip.',
      ],
      documents: ['EPIC or alternate photo ID accepted by ECI'],
      faqs: [
        { q: 'Is voting day a holiday?', a: 'Yes, election day is a paid holiday for employees in the constituency going to polls.' },
        { q: 'What if my name is missing?', a: 'You may approach the Booth Level Officer (BLO), but corrections aren’t possible on polling day.' },
      ],
    },
  });

  return steps;
}

/**
 * Merge step list with saved completion progress.
 */
function applyProgress(steps, completedIds = []) {
  const set = new Set(completedIds);
  let nextAssigned = false;
  return steps.map((s) => {
    if (set.has(s.id)) return { ...s, status: 'completed' };
    if (!nextAssigned) {
      nextAssigned = true;
      return { ...s, status: 'next' };
    }
    return { ...s, status: 'pending' };
  });
}

function readinessPercent(steps) {
  if (!steps.length) return 0;
  const done = steps.filter((s) => s.status === 'completed').length;
  return Math.round((done / steps.length) * 100);
}


/* --- src/components/Hero.js --- */
function Hero({ onStart }) {
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


/* --- src/components/OnboardingForm.js --- */

function OnboardingForm({ initial = {}, onComplete }) {
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


/* --- src/components/StepCard.js --- */
function StepCard({ step, index, onToggle, onOpenDetail }) {
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


/* --- src/components/Roadmap.js --- */

function Roadmap({ steps, user, onToggle, onOpenDetail, onReset }) {
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


/* --- src/components/ScenarioCards.js --- */

function ScenarioCards({ onPick }) {
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


/* --- src/components/ChatAssistant.js --- */

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

function ChatAssistant() {
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
    apiKey: 'YOUR_GEMINI_API_KEY_HERE', // <-- Replace this with your actual API key

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

    if (!state.apiKey || state.apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      state.messages.push({ role: 'system', text: 'Please add your Gemini API key in the src/components/ChatAssistant.js code to enable chat.' });
      renderMessages();
      return;
    }

    state.messages.push({ role: 'user', text });
    state.messages.push({ role: 'typing' });
    state.loading = true;
    sendBtn.disabled = true;
    renderMessages();

    try {
      const reply = await callGemini(state.apiKey, state.messages.filter(m => m.role !== 'typing' && m.role !== 'system'));
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

async function callGemini(apiKey, messages) {
  // Convert to Gemini "contents" format
  const contents = messages.map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }],
  }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { role: 'system', parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: { temperature: 0.5, maxOutputTokens: 800 },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API ${res.status}: ${err.slice(0, 120)}`);
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini');
  return text.trim();
}


/* --- src/main.js --- */

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

