var request = require('request')
var _ = require('lodash')

const search = (req) => {
  return new Promise((resolve, reject) => {

    const apiKey = '24191a48';
    const s = req.body.s;

    var options = {
      uri: `http://www.omdbapi.com/?s=${s}&apikey=${apiKey}`,
      method: 'GET',
      json: true
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

const parse = (data) => _.map(data['Search'], (value, key, collection) => {
    return {
      'header': `OMDB - ${value['Type']} `
        + `<a href="https://www.imdb.com/title/${value['imdbID']}/">`
        + `(${value['Year']}) <b>Title: ${value['Title']}</b>`
        + `</a>`,
      'typeItem': 'DEFAULT',
      'content': ''
    }
  })

module.exports = search;
