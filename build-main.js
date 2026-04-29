const fs = require('fs');
const path = require('path');

const files = [
  'src/utils/constants.js',
  'src/logic/roadmapGenerator.js',
  'src/components/Hero.js',
  'src/components/OnboardingForm.js',
  'src/components/StepCard.js',
  'src/components/Roadmap.js',
  'src/components/ScenarioCards.js',
  'src/components/ChatAssistant.js',
  'src/main.js'
];

let finalCode = '';

for (const file of files) {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
  let cleaned = content.split('\n').filter(line => !line.startsWith('import ')).join('\n');
  cleaned = cleaned.replace(/export const /g, 'const ');
  cleaned = cleaned.replace(/export function /g, 'function ');
  cleaned = cleaned.replace(/export default function /g, 'function ');
  
  // if it's main.js, we don't want to re-declare anything or have issues, but main.js just uses them.
  finalCode += `\n/* --- ${file} --- */\n` + cleaned + '\n';
}

fs.writeFileSync(path.join(__dirname, 'src/main.js'), finalCode);
console.log('Successfully bundled main.js');
