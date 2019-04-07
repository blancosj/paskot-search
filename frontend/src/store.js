import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { combineReducers } from 'redux'
import _ from 'lodash'
import { persistStore, persistReducer, REHYDRATE } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import JSONStream from 'JSONStream'

const { chain }  = require('stream-chain')
const { parser } = require('stream-json')
const { pick }   = require('stream-json/filters/Pick')
const { ignore } = require('stream-json/filters/Ignore')
const { streamValues } = require('stream-json/streamers/StreamValues')
const { streamArray } = require('stream-json/streamers/StreamArray')

const FILTER_RESULTS = 'FILTER_RESULTS'
const SEARCH_STARTED = 'SEARCH_STARTED'
const SEARCH_PROGRESS = 'SEARCH_PROGRESS'
const SEARCH_SUCCESS = 'SEARCH_SUCCESS'
const CLEAN_RESULTS = 'CLEAN_RESULTS'

const INITIAL_STATE = {
  q: '',
  results: [],
  filter: '',
  searching: false,
  doNewSearch: false
}

const rehydrationComplete = () => _.noop()

export const cleanResults = () => (dispatch, getState) =>
  dispatch({
    type: CLEAN_RESULTS
  })

export const filterResults = filter => (dispatch, getState) =>
  dispatch({
    type: FILTER_RESULTS,
    filter
  })

export const searchRequest = q => (dispatch, getState) => {

  dispatch({
    type: SEARCH_STARTED,
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
          dispatch({
            type: SEARCH_PROGRESS,
            results: [ data.value ],
            q
          })
        }
      ])

      pipeline.on('end', () => {
        dispatch({ type: SEARCH_SUCCESS })
      })

      const processor = result => {
        if (result.done) {
          pipeline.emit('end')
          return;
        }

        pipeline.write(result.value)
        reader.read().then(processor)
      }

      reader.read().then(processor)
    })
  }

export const search = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CLEAN_RESULTS:
      return INITIAL_STATE
    case SEARCH_STARTED:
      return {...state,
        ...{
          q: action.q,
          results: [],
          filter: '',
          searching: true,
          doNewSearch: false
        }
      }
    case SEARCH_PROGRESS:
      if (!_.isArray(action.results)) {
        return state
      }

      const results = state.results
        .concat(_.filter(_.flattenDeep(action.results), (x) => !_.isEmpty(x)))

      const sortedResults = _.sortBy(results, i => i.meta.sorted)

      return {...state,
        ...{
          results: sortedResults
        }
      }
    case SEARCH_SUCCESS:
      return {...state,
        ...{
          searching: false
        }
      }
    case FILTER_RESULTS:
      return {...state,
        ...{ filter: action.filter }
      }
    case REHYDRATE:
      const params = new URLSearchParams(window.location.search)
      if (_.get(action, 'payload.search.q', '') !== params.get('q')) {
        return {...state,
          ...{
            q: params.get('q'),
            results: [],
            doNewSearch: true
          }
        }
      } else {
        return state
      }
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
const middleware = [thunk]

if (NODE_LOG_MODE === 'DEBUG') {
  middleware.push(createLogger())
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
)

export default () => {
  const store = createStore(persistedReducer, initialState, composedEnhancers)
  return {
    store,
    persistor: persistStore(store, {}, rehydrationComplete)
  }
}
