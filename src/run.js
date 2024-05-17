const generateStringChangelog = require("./changelog.js");
const Config = require("./config.js");
const Git = require("./git.js");
const core = require("@actions/core");

async function run() {
    const preset = await require("./preset/index")();
    const config = new Config();
    const git = new Git(config);
    
    // Prep the git stuff
    await git.init();
    await git.pull();

    // Get the version
    const tags = await gitSemverTags({ tagPrefix: "v", skipUnstable: true })
    const version = tags.length > 0 ? tags.shift().replace("v", '') : null

    // Generate the change log
    const stringChangelog = await generateStringChangelog("v", preset, version, 1, preset, "", true);

    // Removes the version number from the changelog
    const cleanChangelog = stringChangelog.split('\n').slice(3).join('\n').trim()
    core.info(cleanChangelog);

    core.setOutput("clean_changelog", cleanChangelog);

    try {
        await core.summary.addHeading(`v${version}`, 2).addRaw(cleanChangelog).write();
    } catch (err) {
        core.warning(`Was unable to create summary! Error: "${err}"`)
    }
}

module.exports = run;