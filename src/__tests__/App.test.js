import { Suspense } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from '../App'
import entireStore from '../Redux/store'

jest.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: jest.fn() },
  useTranslation: () => {
    return {
      t: str => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    }
  },
}))

describe('App', () => {
  it('Render without crashing', () => {
    shallow(
      <Provider store={entireStore.store}>
        <BrowserRouter>
          <Suspense fallback={'qwd'}>
            <App />
          </Suspense>
        </BrowserRouter>
      </Provider>,
    )
  })
})
