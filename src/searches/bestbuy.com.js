var request = require('request')
var _ = require('lodash')

const LIMIT_RESULTS = 10

const search = (req) => {
  return new Promise((resolve, reject) => {

    const apiKey = 'lA1tfwA9Ga618aKoBBPv3Xo7'
    const s = req.body.s.split(' ').map(x => `search=${x}`).join('&')

    var options = {
      uri: `https://api.bestbuy.com/v1/products(${encodeURI(s)})?format=json&show=sku,name,salePrice,longDescription&apiKey=${apiKey}`,
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

const regex = /([a-z0-9]+)/gm;

const parse = (data) => _.map(_.take(data['products'], LIMIT_RESULTS), (value, key, collection) => {

    const sku = value['sku']
    const name = value['name']
    const salePrice = value['salePrice']
    const longDescription = value['longDescription']
    const url = calculateProductUrl(name, sku)

    return {
      'header': `<a href="${url}">${name} - &#xFF04;${salePrice}</a> - BestBuy`,
      'typeItem': 'DEFAULT',
      'content': `${longDescription}`,
      'meta': {
        'sorted': _.kebabCase(_.deburr(name.substring(0, 10)))
      },
      'source': 'bestbuy'
    }
  })

const calculateProductUrl = (name, sku) => {
  const regex = /([a-z0-9]+)/gm

  let m
  let ret = []

  while ((m = regex.exec(name)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
          regex.lastIndex++;
      }

      ret = ret.concat(_.first(m))
  }

  const url = ret.join('-')

  return `https://www.bestbuy.com/site/${url}/${sku}.p`
}

module.exports = search
