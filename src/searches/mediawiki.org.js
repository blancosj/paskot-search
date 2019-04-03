var request = require('request')
var _ = require('lodash')

const search = (req) => {
  return new Promise((resolve, reject) => {

    const s = req.body.s

    var options = {
      uri: `https://en.wikipedia.org/w/api.php`,
      method: 'GET',
      json: true,
      qs: {
        action: 'opensearch',
        search: s,
        limit: '5',
        namespace: '0',
        format: 'json'
      }
    }

    request(options, (err2, res2, body2) => {
      if (err2) {
        resolve([]);
      } else {
        resolve(parse(body2));
      }
    })
  })
}

const parse = (data) => {
  const search = _.first(data)
  const keys = data[1]
  const previews = data[2]
  const links = data[3]

  return _.map(keys, (value, key, collection) => {
    return {
      'header': `<a href="${links[key]}">${value}</a> - Wikipedia`,
      'typeItem': 'DEFAULT',
      'content': previews[key],
      'meta': {
        'sorted': '000wiki' + _.kebabCase(_.deburr(value.substring(0, 10)))
      },
      'source': 'wiki'
    }}
  )
}

module.exports = search
