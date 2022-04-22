import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import './i18n'

import App from './App'
import './scss/common.scss'
import entireStore from './Redux/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter } from 'react-router-dom'
import { Loader } from './Components'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={entireStore.store}>
      <PersistGate loading={null} persistor={entireStore.persistor}>
        <BrowserRouter>
          <Suspense fallback={<Loader />}>
            <App />
          </Suspense>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)
