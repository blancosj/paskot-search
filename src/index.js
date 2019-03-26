
var express = require('express');
var bodyParser = require('body-parser')

// Create the app
var app = express();

var search = require('./search');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));

var server_port = process.env.YOUR_PORT || process.env.PORT || 8081;
var server_host = process.env.YOUR_HOST || '0.0.0.0';

app.post('/q', search);

var server = app.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});
