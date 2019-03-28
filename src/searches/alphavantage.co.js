var request = require('request')
var _ = require('lodash')

const search = (req) => {
  return new Promise((resolve, reject) => {

    const apiKey = 'I7198M3Q1SPM2KG1'
    const s = req.body.s

    var options = {
      uri: `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURI(s)}&apikey=${apiKey}`,
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

const parse = (data) => {

  if (_.isEmpty(_.get(data, 'Global Quote', []))) {
    return []
  }

  let result = {
    header: `${data['Global Quote']['01. symbol']} - Alphavantage`,
    typeItem: 'TABLE',
    content: {
      'caption': `Global Quote`,
      'header': [ 'Property', 'Value' ],
      'data': data['Global Quote'],
      'meta': {
        'sorted': _.first(data['Global Quote'])
      }
    },
    'source': 'stock'
  }

  return result
}

module.exports = search;
