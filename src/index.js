import React from 'react'
import ReactDOM from 'react-dom'
import './i18n'

import App from './App'
import './scss/common.scss'
import { Provider } from 'react-redux'
import entireStore from './Redux/store'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={entireStore.store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)
