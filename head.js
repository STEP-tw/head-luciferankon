const fs = require('fs');
let givenFiles = process.argv.slice(2);

const readFiles = function(path){
  return fs.readFileSync(path,'utf-8');
}

console.log(givenFiles.map(readFiles));
