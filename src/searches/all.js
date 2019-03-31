var request = require('request')
var _ = require('lodash')
// var _ = require('highland')
var JSONStream = require('JSONStream')
var Promise = require('bluebird')

const items = [
  require('./mediawiki.org.js'),
  require('./alphavantage.co-keyword.js'),
  require('./alphavantage.co-ticker.js'),
  require('./omdbapi.com.js'),
  require('./github.com.js'),
  require('./bestbuy.com.js')
]

const all2 = (req, res) => {

  res.write('{"findings":[')

  return Promise
    .map(items, source => source(req), { concurrency: 6 })
    .each(result => _.map(result, x => JSON.stringify(x))
      .forEach(x => res.write(x.concat(',')))
    )
    .then(() => res.end('null}'))
}

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

module.exports = all2;
