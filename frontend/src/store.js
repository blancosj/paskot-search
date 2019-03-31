import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { combineReducers } from 'redux'
import _ from 'lodash'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import JSONStream from 'JSONStream'

const {chain}  = require('stream-chain')
const {parser} = require('stream-json')
const {pick}   = require('stream-json/filters/Pick')
const {ignore} = require('stream-json/filters/Ignore')
const {streamValues} = require('stream-json/streamers/StreamValues')
const {streamArray } = require('stream-json/streamers/StreamArray')

export const filterResults = filter => (dispatch, getState) =>
  dispatch({
    type: 'FILTER_RESULTS',
    filter
  })


// parserStream.on('data', data => console.log)

export const searchRequest = q => (dispatch, getState) => {

  dispatch({
    type: 'SEARCH_STARTED',
    q
  })

  fetch('/q', {
      method: 'POST',
      body: JSON.stringify({ s: q }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.body)
    .then(body => {

      const reader = body.getReader()

      const pipeline = chain([
        parser(),
        pick({filter: 'findings'}),
        streamArray(),
        data => {
          const item = data.value;

          dispatch({
            type: 'SEARCH_PROGRESS',
            results: [ item ],
            q
          })
        }
      ])

      // pipeline.write(reader)

      const processor = result => {

        if (result.done) {

          dispatch({
            type: 'SEARCH_SUCCESS',
            results: [],
            q
          })
          return;
        }

        pipeline.write(result.value)

        reader.read().then(processor)
      }

      reader.read().then(processor)

      console.debug(pipeline)

      // const reader = body.getReader()
      // const stream = new ReadableStream({
      //     start(controller) {
      //       return pump();
      //       function pump() {
      //         return reader.read().then(({ done, value }) => {
      //           // When no more data needs to be consumed, close the stream
      //           if (done) {
      //               controller.close();
      //               return;
      //           }
      //           // Enqueue the next data chunk into our target stream
      //           controller.enqueue(value);
      //           return pump();
      //         });
      //       }
      //     }
      //   })

    })
  }


    // let getItem = (item, a) => {
    //
    //   console.log(item)
    //
    //   dispatch({
    //     type: 'SEARCH_SUCCESS',
    //     results: item,
    //     q
    //   })
    // }
    //
    // let stream = JSONStream.parse('findings.*')
    //   .on('data', getItem)
    //   .on('end', () => console.log('FIN'))
    //
    // // stream.autoDestroy = false
    //
    // let process = ({ result, reader }) => {
    //   if (result.done) {
    //     return;
    //   }
    //
    //   stream.write(result.value)
    //
    //   reader.read().then((result) => process({ result, reader }))
    // }



    // // .then(reader => reader.read())
    // .then(reader => {
    //   // reader.read().then((result) => process({ result, reader }))
    //
    //   const r = reader
    //
    //   const pipeline = chain([
    //     reader,
    //     parser(),
    //     pick({filter: 'findings'}),
    //     streamValues(),
    //     data => {
    //       const item = data.value;
    //
    //       dispatch({
    //         type: 'SEARCH_SUCCESS',
    //         results: item,
    //         q
    //       })
    //     }
    //   ])



    // })
    //   .then(({ value }) => {
    //     // var chunk = new TextDecoder('utf-8').decode(value)
    //     // console.log(chunk)
    //     stream.write(value)
    //
    //     reader.read()
    //   })
    //
    // )

      // const reader = response.body.getReader();
      //
      // reader.read().then(function processText({ done, value }) {
      //
      //   if (done) {
      //     console.log('Stream complete')
      //     return;
      //   }
      //   // var chunk = new TextDecoder('utf-8').decode(value)
      //   // console.log(chunk)
      //
      //   stream.write(value)
      //
      //   return reader.read().then(processText)
      // })

  // }

// export const searchRequest2 = q => (dispatch, getState) => fetch('/q', {
//       method: 'POST',
//       body: JSON.stringify({ s: q }),
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     })
//     .then(res => res.json())
//     .then(json => {
//       dispatch({
//         type: 'SEARCH_SUCCESS',
//         results: json,
//         q
//       })
//     })

export const search = (state = { q: '', results: [], filter: '', searching: false }, action) => {
  switch (action.type) {
    case 'SEARCH_STARTED':
      return {...state,
        ...{
          q: action.q,
          results: [],
          filter: '',
          searching: true
        }
      }
    case 'SEARCH_PROGRESS':
      return {...state,
        ...{
          results: state.results.concat(_.filter(action.results, _.isObject)),
          searching: true
        }
      }
    case 'SEARCH_SUCCESS':
      return {...state,
        ...{
          searching: false
        }
      }
    case 'FILTER_RESULTS':
      return {...state,
        ...{ filter: action.filter }}
    default:
      return state
  }
}

const persistConfig = {
  key: 'root',
  storage
}

const persistedReducer = persistReducer(persistConfig, combineReducers({ search }))

const initialState = {}
const enhancers = []
const middleware = [thunk, createLogger()]

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
)

export default () => {
  const store = createStore(persistedReducer, initialState, composedEnhancers)
  return {
    store,
    persistor: persistStore(store)
  }
}
