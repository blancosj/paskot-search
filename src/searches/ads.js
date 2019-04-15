const request = require('request')
const _ = require('lodash')
const uuidv1 = require('uuid/v1')

const ads = (req) => {
  return new Promise((resolve, reject) => {
    resolve([
      {
        'typeItem': 'ADS',
        'meta': {
          'sorted': uuidv1()
        },
        'source': 'ads'
      }
    ])
  })
}
  //

  // }

module.exports = ads
