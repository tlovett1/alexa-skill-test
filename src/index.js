import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import App from './containers/App'
import reducer from './reducers'
import thunk from 'redux-thunk'
const debug = require('debug')('app')

const store = createStore(reducer, applyMiddleware(thunk));

if (DEBUG) {
  localStorage.debug = 'app'
}

debug('Running Alexa Skill Test in debug mode.')

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
