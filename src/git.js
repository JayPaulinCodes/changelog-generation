const Config = require("./config.js");
const _exec = require("@actions/exec");
const exec = _exec.exec;

const { GITHUB_REPOSITORY, ENV } = process.env

class Git {
    #actionConfig = new Config();
    commandsRun = [];

    constructor(actionConfig) {
        this.#actionConfig = actionConfig;
    }

    #execute(command) {
        if (ENV === "dont-use-git") {
            const fullCommand = `git ${command}`;

            console.log(`Skipping "${fullCommand}" because of test env`);

            if (!fullCommand.includes("git remote set-url origin")) {
                this.commandsRun.push(fullCommand);
            }
        } else {
            return new Promise(async (resolve, reject) => {
                let output = "";
    
                const exitCode = await exec(`git ${command}`, null, {
                    listeners: {
                        stdout: (data) => { output += data.toString(); },
                    },
                });
    
                if (exitCode === 0) {
                    resolve(output);
                } else {
                    reject(`Command "git ${command}" exited with code ${exitCode}.`);
                }
            });
        }
    }

    async init() {
        const githubToken = this.#actionConfig["github-token"];
        const gitUserName = this.#actionConfig["committer-name"];
        const gitUserEmail = this.#actionConfig["committer-email"];

        // Set config
        await this.config("user.name", gitUserName);
        await this.config("user.email", gitUserEmail);

        // Update the origin
        if (githubToken) {
            await this.updateOrigin(`https://x-access-token:${githubToken}@github.com/${GITHUB_REPOSITORY}.git`);
        }
    }

    async config(prop, val) {
        return this.#execute(`config ${prop} "${val}"`);
    }

    async add(file) {
        return this.#execute(`add ${file}`);
    }

    async commit(message) {
        return this.#execute(`commit -m "${message}"`);
    }

    async pull() {
        const args = [ "pull" ];

        // Check if the repo is unshallow
        if (await this.isShallow()) {
            args.push("--unshallow");
        }

        args.push("--tags");
        args.push("--ff-only");

        return this.#execute(args.join(" "));
    }

    async push(branch) {
        return this.#execute(`push origin ${branch} --follow-tags`);
    }

    async isShallow() {
        if (ENV === "dont-use-git") { return false; }
        const isShallow = await this.#execute("rev-parse --is-shallow-repository");
        return isShallow.trim().replace("\n", "") === "true";
    }

    async updateOrigin(repoUrl) {
        return this.#execute(`remote set-url origin ${repoUrl}`);
    }

    async createTag(tag) {
        return this.#execute(`tag -a ${tag} -m "${tag}"`);
    }
}

module.exports = Git;
