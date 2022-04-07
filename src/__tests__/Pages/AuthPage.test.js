import React from 'react'
import { AuthPage } from '../../Pages'
import { create } from 'react-test-renderer'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n'

const mockStore = configureStore([])
const store = mockStore({ contacts: [] })

describe('Auth Pages Component', () => {
  const component = create(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <AuthPage />
      </I18nextProvider>
    </Provider>,
  )
  test('', () => {
    const instance = component.getInstance()
    const header = instance.findByType('header')
    expect(header).toHaveLength(1)
  })
})
