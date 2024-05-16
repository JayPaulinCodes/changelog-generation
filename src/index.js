import { run } from "./run.js";

try {
    run();
} catch (error) {
    core.setFailed(error.message);
}
