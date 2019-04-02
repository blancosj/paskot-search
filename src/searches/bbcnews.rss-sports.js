var request = require('request')
var _ = require('lodash')
var Stream = require('stream')

var XmlStream = require('xml-stream')

const LIMIT_RESULTS = 10

const search = (req) => {
  return new Promise((resolve, reject) => {

    const s = _.words(req.body.s)

    var options = {
      uri: `http://feeds.bbci.co.uk/sport/rss.xml`,
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
        parse(result.filter(item => match(item, s)))
      )
    })
    
    request(options).pipe(pass)
  })
}

const match = (data, search) =>
  !_.isEmpty(_.intersectionBy(_.words(data['title']), _.words(search), _.lowerCase))

const parse = data => _.map(data, (value, key, collection) => {
    return {
      'header': `<a href="${value['link']}">${value['title']}</a> - BBC News Sports`,
      'typeItem': 'DEFAULT',
      'content': `${value['description']}`,
      'meta': {
        'sorted': _.kebabCase(_.deburr(value['title'].substring(0, 10)))
      },
      'source': 'bbcnews'
    }
  })

module.exports = search
