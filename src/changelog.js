const conventionalChangelog = require("conventional-changelog");

async function getChangelogStream(
    tagPrefix,
    preset,
    version,
    releaseCount,
    config,
    gitPath,
    skipUnstable
) {
    return conventionalChangelog(
        {
            preset,
            releaseCount: parseInt(releaseCount, 10),
            tagPrefix,
            config,
            skipUnstable,
        },
        {
            version,
            currentTag: `${tagPrefix}${version}`,
        },
        {
            path: gitPath === "" || gitPath === null ? undefined : gitPath,
        },
        config && config.parserOpts,
        config && config.writerOpts
    );
}

export default function generateStringChangelog(
    tagPrefix,
    preset,
    version,
    releaseCount,
    config,
    gitPath,
    skipUnstable
) {
    return new Promise(async (resolve) => {
        const changelogStream = await getChangelogStream(
            tagPrefix,
            preset,
            version,
            releaseCount,
            config,
            gitPath,
            skipUnstable
        );

        let changelog = "";

        changelogStream
            .on("data", (data) => {
                changelog += data.toString();
            })
            .on("end", () => resolve(changelog));
    });
}
