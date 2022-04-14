import React from 'react'
import { create } from 'react-test-renderer'
import { Provider } from 'react-redux'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import entireStore from '../../Redux/store'

import i18n from '../../i18n'
import Alert from '../../Components/TrustedUsers/Alert/Alert'

describe('Alert Component', () => {
  const component = create(
    <Provider store={entireStore.store}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<Alert />}></Route>
          </Routes>
        </BrowserRouter>
      </I18nextProvider>
    </Provider>,
  )
  const root = component.root

  test('Component has three buttons tags', async () => {
    const button = await root.findAllByType('button')
    expect(button).toHaveLength(2)
  })
})
