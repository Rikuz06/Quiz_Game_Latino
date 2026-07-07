const fs = require('fs');
const path = require('path');

const vocabFile = fs.readFileSync('js/vocab.js', 'utf8');

// Use regex to find all { latin: "...", italian: "..." } objects
const regex = /\{\s*latin:\s*"([^"]+)",\s*italian:\s*"([^"]+)"/g;
let match;
const vocabMap = {};

while ((match = regex.exec(vocabFile)) !== null) {
  const latin = match[1];
  const italian = match[2];
  vocabMap[latin] = italian;
}

console.log(JSON.stringify(vocabMap, null, 2));
