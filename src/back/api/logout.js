const Output = require('./util/Output.js').Output;

function post(req, res) {
    var o = new Output(res);
    req.session.userId = null;
    o.set().out();
}

module.exports = { post };
