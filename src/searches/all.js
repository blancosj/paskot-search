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
  require('./bestbuy.com.js'),
  // require('./bbcnews.rss-sports.js'),
  require('./extract-rss.js')
    ('http://feeds.bbci.co.uk/sport/rss.xml', 'news', 'BBC News Sports'),
  require('./extract-rss.js')
    ('https://www.cnet.com/rss/news/', 'news', 'CNET News'),
  require('./extract-rss.js')
    ('http://www.espnfc.com/rss', 'news', 'ESPN FC News'),
  require('./extract-rss.js')
    ('http://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml', 'news', 'New York Times News'),
  require('./extract-rss.js')
    ('http://rss.cnn.com/rss/edition_world.rss', 'news', 'CNN News'),
  require('./extract-rss.js')
    ('https://www.npr.org/rss/rss.php', 'news', 'NPR Stories'),    
]

const all3 = (req, res) => {

  res.setHeader('Connection', 'Transfer-Encoding')
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Transfer-Encoding', 'chunked')
  res.writeHead(200)

  res.write('{"findings":[')

  return Promise
    .map(items, source => source(req)
      .then(x => {
        res.write(JSON.stringify(x).concat(','))
        // process.stdout.write(JSON.stringify(x))
        // JSON.stringify(x).each(value => res.write(value.concat(',')))
      })
      // .each(value => res.write(value.concat(',')))
      , { concurrency: 6 })
    // .each(result => _.map(result, x => JSON.stringify(x))
    //   .forEach(x => {
    //     process.stdout.write("SENT!")
    //     return res.write(x.concat(','))
    //   })
    // )
    .then(() => res.end('null]}'))
}

const all2 = (req, res) => {

  res.setHeader('Connection', 'Transfer-Encoding')
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Transfer-Encoding', 'chunked')
  res.writeHead(200)

  res.write('{"findings":[')

  return Promise
    .map(items, source => source(req), { concurrency: 6 })
    .each(result => _.map(result, x => JSON.stringify(x))
      .forEach(x => {
        process.stdout.write("SENT!")
        return res.write(x.concat(','))
      })
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

module.exports = all3;
