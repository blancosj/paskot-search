var request = require('request')
var _ = require('lodash')

const LIMIT_RESULTS = 3

const search = (req) => {
  return new Promise((resolve, reject) => {

    const apiKey = 'I7198M3Q1SPM2KG1'
    const s = req.body.s

    var options = {
      uri: `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURI(s)}&apikey=${apiKey}`,
      method: 'GET',
      json: true
    }

    request(options, (err2, res2, body2) => {
      if (err2) {
        resolve([]);
      } else {
        resolve(parse(body2))
      }
    })
  })
}

const parse = (data) => _.map(_.take(data['bestMatches'], LIMIT_RESULTS), (value, key, collection) => {
    return {
      header: `${value['1. symbol']} - Alphavantage`,
      typeItem: 'TABLE',
      content: {
        'caption': `Company Quote`,
        'header': [ 'Property', 'Value' ],
        'data': value,
        'meta': {
          'sorted': _.first(value['name'])
        }
      },
      'source': 'stock'
    }
  })

module.exports = search
