# Civic Sense

**Your Personal Guide to Voting in India** — a vanilla HTML/CSS/JS interactive assistant that builds a personalized voting roadmap, links to official Election Commission resources, and chats with users via Gemini.

## Run locally

This is a pure static site. Just open `index.html` in any modern browser:

```bash
# Option A — open directly
open civic-sense/index.html

# Option B — serve (recommended, ES modules need http://)
cd civic-sense
python3 -m http.server 8080
# then visit http://localhost:8080
```

> ES modules require an `http://` origin — opening the file via `file://` may block imports in some browsers. Use a local server.

## Folder structure

```
/civic-sense
 ├── index.html            ← entry, includes top bar / chat shell
 ├── README.md
 └── /src
      ├── main.js          ← orchestrator: state, routing, modal, chat boot
      ├── /styles
      │   └── main.css     ← full design system (saffron + green accents)
      ├── /components
      │   ├── Hero.js          ← landing hero + CTA
      │   ├── OnboardingForm.js← multi-step questionnaire w/ progress bar
      │   ├── ScenarioCards.js ← quick-pick situations
      │   ├── Roadmap.js       ← timeline + readiness % + alerts
      │   ├── StepCard.js      ← individual step (badge, why, skip, actions)
      │   └── ChatAssistant.js ← Gemini-powered chat panel
      ├── /logic
      │   └── roadmapGenerator.js ← generateRoadmap(userData) + progress merge
      └── /utils
          └── constants.js  ← official links, states, questions, scenarios
```

## How it connects

1. **`main.js`** loads user state from `localStorage`, then renders `Hero` → `ScenarioCards` → either `OnboardingForm` (if no user yet) or `Roadmap`.
2. **`OnboardingForm`** collects `firstTime / registered / hasVoterId / changedCity / state` and calls back into `main.js`.
3. `main.js` calls **`generateRoadmap(user)`** (in `/logic`) which returns a personalized step list. Step IDs are merged with `localStorage` completion progress.
4. **`Roadmap`** renders the timeline using **`StepCard`**, including a live "X% ready to vote" indicator and contextual alerts.
5. Clicking a card's **View details & FAQs** opens a modal (handled in `main.js`) with a full breakdown — explanation, how-to, documents, FAQs.
6. Each step's action buttons link directly to **official ECI / NVSP / Voters' Portal** URLs (in `/utils/constants.js`).
7. The floating **chat FAB** (or top-bar "Ask Assistant") opens **`ChatAssistant`**, which calls the Gemini REST API directly from the browser using a key the user pastes (stored in `localStorage`).

## Roadmap rules

| User input | Step added |
|---|---|
| `registered === 'no'` or `'unsure'` | Register to Vote (Form 6) |
| `hasVoterId === 'no'` | Apply for Voter ID (EPIC) |
| `changedCity === 'yes'` | Update Address / Transfer Constituency (Form 8) |
| Always | Verify Voter Details |
| Always | Find Polling Booth |
| Always | Election Day Preparation |

## Gemini AI chat

- Click the chat bubble (bottom-right) or **Ask Assistant** in the top bar.
- Paste a Gemini API key (get a free one at https://aistudio.google.com/app/apikey).
- The key is stored only in your browser's `localStorage` and sent only to `generativelanguage.googleapis.com`.
- The assistant is system-prompted to stay focused on Indian elections.
- Model: `gemini-2.5-flash`.

## Persistence

All state is in `localStorage`:
- `civic_sense_user` — answers from onboarding / scenario
- `civic_sense_progress` — array of completed step IDs
- `civic_sense_gemini_key` — your Gemini key (local only)

Click **↻ Restart questionnaire** at the top of the roadmap to clear and start over.
