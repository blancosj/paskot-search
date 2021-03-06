const request = require('request')
const _ = require('lodash')
const Stream = require('stream')
const moment = require('moment')
const process = require('process')
const PassThroughTryCatch = require('./PassThroughTryCatch')

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

    const pass = new PassThroughTryCatch()
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

    let title = value['title']

    _.each(value['m'], i => title = title.replace(i, `<code>${i}</code>`))

    const pubDate = moment(value['pubDate'])

    return {
      'header': `<a href="${value['link']}">${title}</a> `
        + `<small>${pubDate.format('ll')} - ${titleTail}</small>`,
      'typeItem': 'DEFAULT',
      'content': `${value['description']}`,
      'meta': {
        'sorted': Number.MAX_SAFE_INTEGER - pubDate.valueOf()
          + _.padStart(Number.MAX_SAFE_INTEGER - value['m'].length, 10, '0')
          + _.kebabCase(_.deburr(value['title'].substring(0, 10)))
      },
      'source': source
    }
  })

module.exports = search
