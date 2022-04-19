import React from 'react'
import { create } from 'react-test-renderer'
import { Provider } from 'react-redux'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
// import { I18nextProvider } from 'react-i18next'
import entireStore from '../../Redux/store'

// import i18n from '../../i18n'
import { Alert } from '../../Components'

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: str => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    }
  },
}))

describe('Alert Component', () => {
  const component = create(
    <Provider store={entireStore.store}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Alert />}></Route>
        </Routes>
      </BrowserRouter>
    </Provider>,
  )
  const root = component.root

  test('Component has three buttons tags', async () => {
    const button = await root.findAllByType('button')
    expect(button).toHaveLength(2)
  })
})
