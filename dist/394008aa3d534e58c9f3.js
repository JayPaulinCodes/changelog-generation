const createParserOpts = require("./parser.js").createParserOpts;
const createWriterOpts = require("./writer.js").createWriterOpts;
const whatBump = require("./whatBump.js").whatBump;


async function createPreset () {
  return {
    parser: createParserOpts(),
    writer: await createWriterOpts(),
    whatBump
  }
}

module.exports = createPreset;
