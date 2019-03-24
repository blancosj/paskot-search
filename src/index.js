
var express = require('express');
// Create the app
var app = express();

app.use(express.static('public'));

var server_port = process.env.YOUR_PORT || process.env.PORT || 8081;
var server_host = process.env.YOUR_HOST || '0.0.0.0';

app.get('/', (req, res) => res.send('Hello World!'));

var server = app.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});
