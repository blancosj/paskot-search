var request = require('request')
var _ = require('lodash')
var Stream = require('stream')

var XmlStream = require('xml-stream')

const LIMIT_RESULTS = 10

const search = (url, source, titleTail) => (req) => {
  return new Promise((resolve, reject) => {

    const s = _.words(req.body.s)

    var options = {
      uri: url,
      headers: {
        'User-Agent': 'paskot-client'
      },
      method: 'GET'
    }

    let result = [ ]
    const { PassThrough } = new require('stream')
    const pass = new PassThrough()
    const xml = new XmlStream(pass)

    xml.on('endElement: item', item => {
      result = [...result, item]
    })

    pass.on('end', () => {
      resolve(
        parse(source, titleTail)(result.filter(item => match(item, s)))
      )
    })

    request(options).pipe(pass)
  })
}

const match = (data, search) =>
  !_.isEmpty(_.intersectionBy(_.words(data['title']), _.words(search), _.lowerCase))

const parse = (source, titleTail) => data => _.map(data, (value, key, collection) => {
    return {
      'header': `<a href="${value['link']}">${value['title']}</a> - ${titleTail}`,
      'typeItem': 'DEFAULT',
      'content': `${value['description']}`,
      'meta': {
        'sorted': _.kebabCase(_.deburr(value['title'].substring(0, 10)))
      },
      'source': source
    }
  })

module.exports = search
