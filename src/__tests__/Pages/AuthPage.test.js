import React from 'react'
import { AuthPage } from '../../Pages'
import { create } from 'react-test-renderer'
import { Provider } from 'react-redux'
import { ThemeBtn, LangBtn } from '../../Components'
import { Logo } from '../../images'
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
  const root = component.root

  test('Component Have Header', () => {
    const header = root.findAllByType('header')
    expect(header).toHaveLength(1)
  })

  test('Component have languages button', () => {
    root.findByType(LangBtn)
  })

  test('Component have themes button', () => {
    root.findByType(ThemeBtn)
  })

  test('Component have header Logo', () => {
    root.findByType(Logo)
  })
})
