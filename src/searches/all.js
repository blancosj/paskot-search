const request = require('request')
const _ = require('lodash')
const JSONStream = require('JSONStream')
const Promise = require('bluebird')

const items = [
  require('./ads.js'),
  require('./mediawiki.org.js'),
  require('./alphavantage.co-keyword.js'),
  require('./alphavantage.co-ticker.js'),
  require('./omdbapi.com.js'),
  require('./github.com.js'),
  require('./bestbuy.com.js'),
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
  require('./extract-rss.js')
    ('http://news.nationalgeographic.com/index.rss', 'news', 'National Geographic'),
  require('./extract-rss.js')
    ('https://hnrss.org/newest', 'news', 'Hacker News'),
  require('./extract-rss.js')
    ('https://www.cbssports.com/rss/headlines/soccer/', 'news', 'CBS Sports News'),
  require('./extract-rss.js')
    ('http://feeds.feedburner.com/SlickdealsnetUP', 'deals', 'Slick Deals'),
  require('./nasa.gov-images.js'),
  require('./extract-rss.js')
    ('https://expandfurniture.com/feed/', 'deals', 'Expand Furniture')
]

const all = (req, res) => {

  res.setHeader('Connection', 'Transfer-Encoding')
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Transfer-Encoding', 'chunked')
  res.writeHead(200)

  res.write('{"findings":[')

  if (!_.isString(req.body.s)) {
    res.write(']}')
    res.end()
    return
  }

  return Promise
    .map(items, source => source(req)
      .then(x => {
        res.write(JSON.stringify(x).concat(','))
      })
      , { concurrency: 6 })
    .then(() => res.end('null]}'))
}

module.exports = all;
