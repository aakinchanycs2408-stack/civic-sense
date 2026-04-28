import { LINKS } from '../utils/constants.js';

/**
 * Generates a personalized voting roadmap based on the user's situation.
 * @param {object} user - { firstTime, registered, hasVoterId, changedCity, state }
 * @returns {Array<Step>}
 */
export function generateRoadmap(user = {}) {
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
export function applyProgress(steps, completedIds = []) {
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

export function readinessPercent(steps) {
  if (!steps.length) return 0;
  const done = steps.filter((s) => s.status === 'completed').length;
  return Math.round((done / steps.length) * 100);
}
