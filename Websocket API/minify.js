const fs = require('fs');
const minify = require('minify');

const inputFile = process.argv[2];

if (!inputFile) {
  console.log('Please provide the input file name.');
  process.exit(1);
}

const inputFilePath = `./${inputFile}`;
const outputFilePath = `./minified_${inputFile}`;

async function minifyFile() {
  try {
    const minifiedCode = await minify(inputFilePath);
    fs.writeFileSync(outputFilePath, minifiedCode);
    console.log(`Minified code saved to ${outputFilePath}`);
  } catch (error) {
    console.error('Error minifying code:', error);
  }
}

minifyFile();
