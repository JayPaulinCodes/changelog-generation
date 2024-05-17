const run = require("./run.js");

try {
    run();
} catch (error) {
    core.setFailed(error.message);
}
