/**
 * Some data (e.g. logged-in User) is included in the document that's spat out
 * by the server.
 * Some for pages, this data includes responses from API requests.
 */

const DATA = TREEL_PRE_DATA || {};

function getUser() {
    return DATA.user;
}

function getRequest(url) {
    return DATA.requests[url];
}

export { getUser, request };
