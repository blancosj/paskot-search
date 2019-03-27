import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { combineReducers } from 'redux'
import _ from 'lodash'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

export const searchRequest = q => (dispatch, getState) => fetch('/q', {
      method: 'POST',
      body: JSON.stringify({ s: q }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(json => {
      dispatch({
        type: 'SEARCH_SUCCESS',
        q,
        results: json
      })
    })

export const search = (state = { q: '', results: [] }, action) => {
  switch (action.type) {
    case 'SEARCH_SUCCESS':
      return {...state,
        ...{ q: action.q, results: action.results }}
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
