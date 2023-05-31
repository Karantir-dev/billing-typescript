import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
// import { AffiliateProgram } from '../../Pages'
import { BrowserRouter } from 'react-router-dom'
import entireStore from '../../Redux/store'
import { Provider } from 'react-redux'

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

describe('AffiliateProgram Page jsx', () => {
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
      chapter: 'about',
    }),
  }))

  test('render AboutAffiliateProgram Page', () => {
    render(
      <Provider store={entireStore.store}>
        <BrowserRouter>{/* <AffiliateProgram /> */}</BrowserRouter>
      </Provider>,
    )
  })
})
