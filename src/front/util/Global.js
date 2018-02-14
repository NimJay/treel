/**
 * This file contains global helper methods.
 */

const LOG = true;

function log(message) {
    if (LOG) console.log(message);
    return LOG;
}

export { log };
