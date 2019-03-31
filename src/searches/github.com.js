var request = require('request')
var _ = require('lodash')

const LIMIT_RESULTS = 10

const search = (req) => {
  return new Promise((resolve, reject) => {

    const apiKey = '24191a48'
    const s = req.body.s

    var options = {
      uri: `https://api.github.com/search/repositories?q=${encodeURI(s)}&sort=stars&order=desc`,
      headers: {
        'User-Agent': 'paskot-client'
      },
      method: 'GET',
      json: true
    }

    request(options, (err2, res2, body2) => {
      if (err2) {
        resolve([])
      } else {
        resolve(parse(body2))
      }
    })
  })
}

const parse = (data) => _.map(_.take(data['items'], LIMIT_RESULTS), (value, key, collection) => {

    const name = value['name'] ? value['name'] : ''
    const html_url = value['html_url']
    const login = value['owner']['login']
    let desc = value['description'] ? value['name'] : 'Unknown'

    if (name === desc) {
      desc = ''
    }

    const stargazers_count = value['stargazers_count']

    return {
      'header': `<a href="${value['html_url']}">${name} ${desc ? ', ' + desc : ''}</a> - Github`,
      'typeItem': 'DEFAULT',
      'content': `<sup>&#x2605;</sup>(<ins>${stargazers_count.toLocaleString()}</ins>) <a href="${html_url}">&#64;${login}</a> ${desc}`,
      'meta': {
        'sorted': _.padStart(Number.MAX_SAFE_INTEGER - value['stargazers_count'], 10, '0') + ' ' + _.kebabCase(_.deburr(name.substring(0, 10)))
      },
      'source': 'github'
    }
  })

module.exports = search
