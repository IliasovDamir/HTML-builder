const readline = require('readline');
const fs = require('fs');
const process = require('process');
const path = require('path');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const writeStream = fs.createWriteStream(path.resolve(__dirname, 'text.txt'), 'utf-8');

console.log('\nWhat do you think of this task?\n');

rl.prompt();
rl.on('line', (answer) => {  
  if (answer.match('exit')) {
    console.log(`\nThank you for your valuable feedback.\n`);
    process.exit();
  } 
  else writeStream.write(answer + '\n');
  rl.prompt();
});

rl.on('close', () => {
  console.log('\nThank you for your valuable feedback.\n');
  process.exit();
});