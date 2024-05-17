const createParserOpts = require("./parser.js").createParserOpts;
const createWriterOpts = require("./writer.js").createWriterOpts;
const whatBump = require("./whatBump.js").whatBump;


export default async function createPreset () {
  return {
    parser: createParserOpts(),
    writer: await createWriterOpts(),
    whatBump
  }
}