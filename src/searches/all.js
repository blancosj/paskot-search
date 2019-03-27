var request = require('request');
var _ = require('lodash')

const items = [
  require('./mediawiki.org.js'),
  require('./alphavantage.co.js'),
  require('./omdbapi.com.js')
]

const all = (req, res) => {

  const result = [];

  function rec(list, acc) {
    return new Promise((resolve, reject) => {
      if (_.isEmpty(list)) {
        resolve(acc);
      }
      _.first(list)(req)
        .then((r) => rec(_.tail(list), acc.concat(r)).then(resolve))
    })
  };

  rec(items, [])
    .then((result) => { res.send(_.sortBy(result, (i) => _.get(i, 'meta.sorted', 'Z'))) })
}

module.exports = all;
