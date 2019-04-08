const request = require('request')
const _ = require('lodash')

const LIMIT_RESULTS = 10

const search = (req) => {
  return new Promise((resolve, reject) => {

    const s = req.body.s

    if (!s) {
      resolve([])
    }

    var options = {
      uri: `https://images-api.nasa.gov/search?q=${encodeURI(s)}&media_type=image`,
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

const parse = (data) => {
  const search = data['collection']
  const items = _.take(search['items'], LIMIT_RESULTS)

  return _.map(items, (value, key, collection) => {

    const first = _.first(value['data'])
    const links = value['links']

    return {
      'header': `${first['title']} <small>- Nasa</small>`,
      'typeItem': 'IMAGE',
      'content': first['title'] !== first['description'] ? first['description'] : '',
      'images': _.map(links, link => ({ 'src': link['href'] })),
      'meta': {
        'sorted': '500nasa' + _.kebabCase(_.deburr(first['title'].substring(0, 10)))
      },
      'source': 'nasa'
    }}
  )
}

module.exports = search
