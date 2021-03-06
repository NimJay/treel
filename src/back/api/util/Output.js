/**
 * Output
 * Output manages JSON output of every /api request.
 */
class Output {
    constructor(res) {
        this.res = res; // The Express response object.
        this.o = {}; // The JSON object that is output.
    }
    set(k, v) {
        this.o[k] = v;
        return this;
    }
    get(k) {
        return this.o[k];
    }
    err(e, m) {
        if (!e) e = 'GENERIC';
        this.o.error = ERRORS[e];
        if (m) this.o.error.message = m;
        return this;
    }
    out() {
        this.res.json(this.o);
    }
}


/**
 * List of defined errors.
 */
const ERRORS = {
    'GENERIC': {
        code: 1,
        message: 'Error'
    },
    'MISSING_GET': {
        code: 2,
        message: 'Missing GET variables'
    },
    'MISSING_POST': {
        code: 3,
        message: 'Missing POST variables'
    },
    'INVALID_INPUT': {
        code: 4,
        message: 'Invalid GET/POST variable'
    },
    'DATABASE': {
        code: 5,
        message: 'Database error'
    },
    'EMAIL_TAKEN': {
        code: 6,
        message: 'Email already in use'
    },
    'INVALID_COMBO': {
        code: 7,
        message: 'Invalid combination'
    },
    'NOT_LOGGED_IN': {
        code: 8,
        message: 'Must be logged in'
    },
    'NOT_VERIFIED': {
        code: 9,
        message: 'Email not verified'
    }
};


module.exports = { Output };
