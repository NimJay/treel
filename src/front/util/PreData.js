/**
 * Some data (e.g. logged-in User) is included in the document that's spat out
 * by the server.
 * Some for pages, this data includes responses from API requests.
 */

import { User } from '../model/User.js';

const DATA = TREEL_PRE_DATA || {};

function getUser() {
    if (!DATA.user) return null;
    return new User(DATA.user);
}

function getRequest(url) {
    return DATA.requests[url];
}

export { getUser, request };
