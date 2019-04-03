var request = require('request')
var _ = require('lodash')
var Stream = require('stream')
var moment = require('moment')

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
        parse(source, titleTail)(result
          .map(item => _.assign(item, { m: match(item, s) }))
          .filter(item => item.m.length > 0)
        )
      )
    })

    request(options).pipe(pass)
  })
}

const match = (data, search) =>
  _.intersectionBy(_.words(data['title']), _.words(search), _.lowerCase)

const parse = (source, titleTail) => data => _.map(data, (value, key, collection) => {

    const pubDate = moment(value['pubDate']).format('ll')

    return {
      'header': `<a href="${value['link']}">${value['title']}</a> `
        + `<small>${pubDate} - ${titleTail}</small>`,
      'typeItem': 'DEFAULT',
      'content': `${value['description']}`,
      'meta': {
        'sorted': _.padStart(value['m'].length, 10, '0')
          + _.kebabCase(_.deburr(value['title'].substring(0, 10)))
      },
      'source': source
    }
  })

module.exports = search
