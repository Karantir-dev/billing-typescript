import React, { Suspense } from 'react'
import Navigation from './navigation/Navigation'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { Loader, Portal } from './Components'
import entireStore from './Redux/store'
import 'dayjs/locale/ru'
import 'react-toastify/dist/ReactToastify.css'
import TagManager from 'react-gtm-module'

const tagManagerArgs = {
  gtmId: 'GTM-T5QQQVX',
}

TagManager.initialize(tagManagerArgs)

console.log(window.dataLayer)

export default function App() {
  return (
    <Provider store={entireStore.store}>
      <PersistGate loading={null} persistor={entireStore.persistor}>
        <BrowserRouter>
          <Suspense fallback={<Loader />}>
            <Navigation />
          </Suspense>

          <ToastContainer />
          <Portal>
            <Loader />
          </Portal>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  )
}
