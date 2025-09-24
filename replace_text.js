const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'src/app/game/mines/page.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Create a backup
fs.writeFileSync(filePath + '.bak', content, 'utf8');

// Find the section to replace
const quickTipsRE = /<p className="font-display text-lg text-white mb-3">Quick Tips:<\/p>[\s\S]*?<div className="grid grid-cols-1 gap-3">[\s\S]*?<\/div>/;
const replacement = `<p className="font-display text-lg text-white mb-3">Mines</p>
                    <div className="space-y-3 pr-1">
                      <p>APT Casino's Mines is an exhilarating crypto game where every decision matters. Players begin by selecting the number of mines to place on a 5x5 grid – the more mines you choose, the higher the potential reward but the greater the risk.</p>
                      
                      <p>The objective is to uncover gems while avoiding hidden mines. Each successful gem discovery increases your multiplier, and you can cash out anytime. Will you play it safe with a small win or risk everything for a massive payout? In Mines, the choice is entirely yours!</p>
                      
                      <p>With a dynamic difficulty system, provably fair gameplay, and instant payouts, our Mines game offers an unmatched gaming experience. Set your bet amount, customize your risk level, and step into the thrilling world of strategic crypto gaming.</p>
                    </div>`;

// Replace
const newContent = content.replace(quickTipsRE, replacement);

// Write the new file
fs.writeFileSync(filePath, newContent, 'utf8');

console.log('Successfully replaced Quick Tips with Mines'); 