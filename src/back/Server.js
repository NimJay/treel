const express = require('express');
const PORT = 3003;
var app = express();

// Serve this directory.
app.use(express.static(__dirname + '/../public'));

// Send index.html for all pages.
var sendIndex = (req, res) => {res.sendFile(__dirname + '/../public/index.html');}
app.get('/about', sendIndex);
app.get('/sign-up', sendIndex);

// Everything else: index.html with 404.
app.use((req, res) => {
    res.status(404);
    res.sendFile(__dirname + '/../public/index.html');
});

app.listen(PORT, function () {
    console.log('Serving Treel at: http://localhost:' + PORT);
});
