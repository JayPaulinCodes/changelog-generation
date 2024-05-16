import { getInput, getBooleanInput, getMultilineInput, setSecret } from "@actions/core";

const throwConfigError = (message) => { throw new Error(`Config Error: ${message}`); }
const throwMissingInputError = (input) => throwConfigError(`Missing the value for input "${input}"`);

export class Config {
    ["github-token"];
    #overrideConfig;

    constructor(overrideConfig = {}) {
        this.#overrideConfig = overrideConfig;

        // Fetch the inputs and validate them
        this["github-token"] = getInput("github-token");
        if (this["github-token"] === "") { throwMissingInputError("github-token"); }
        setSecret(this["github-token"]);
        
        this["committer-name"] = getInput("committer-name");
        if (this["committer-name"] === "") { throwMissingInputError("committer-name"); }
        
        this["committer-email"] = getInput("committer-email");
        if (this["committer-email"] === "") { throwMissingInputError("committer-email"); }
    }
}