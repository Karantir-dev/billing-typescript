import { Suspense } from 'react'
import Navigation from './navigation/Navigation'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { Loader, Portal } from '@components'
import entireStore from '@redux/store'
import 'dayjs/locale/ru'
import 'dayjs/locale/uk'
import 'dayjs/locale/kk'
import 'dayjs/locale/ka'
import 'react-toastify/dist/ReactToastify.css'
import TagManager from 'react-gtm-module'
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

const tagManagerArgs = {
  gtmId: 'GTM-T5QQQVX',
}

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: 'https://eb3aa2d250244c83868a97ae819cef41@o1326854.ingest.sentry.io/6587426',
    integrations: [new BrowserTracing()],
    tracesSampleRate: 0.7,
  })
}
TagManager.initialize(tagManagerArgs)

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
