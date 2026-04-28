// Official Indian government election resources
export const LINKS = {
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

export const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra',
  'Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu',
  'Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi (NCT)','Jammu & Kashmir','Ladakh','Puducherry','Chandigarh','Andaman & Nicobar Islands',
  'Dadra & Nagar Haveli and Daman & Diu','Lakshadweep'
];

export const STORAGE_KEYS = {
  user: 'civic_sense_user',
  progress: 'civic_sense_progress',
  apiKey: 'civic_sense_gemini_key',
};

export const ONBOARDING_QUESTIONS = [
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

export const SCENARIOS = [
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

export const ALERTS = [
  {
    id: 'reg-deadline',
    title: 'Registration deadlines move fast',
    body: 'Voter rolls typically close ~10 days before an election notification. Register early to avoid missing out.',
  },
];
