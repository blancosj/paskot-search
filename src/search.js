
var request = require('request');
var all = require('./searches/all')

const search = (req, res) => {
  all(req, res);
}

module.exports = search;
