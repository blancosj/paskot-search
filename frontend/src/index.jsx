import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import configureStore from './store'
import { BrowserRouter as Router, Route } from 'react-router-dom'

const { persistor, store } = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App/>
    </Router>
  </Provider>,
  document.getElementById('syno-nsc-ext-gen3'))
