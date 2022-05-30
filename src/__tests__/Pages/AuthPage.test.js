import React from 'react'
import { AuthPage } from '../../Pages'
import { create } from 'react-test-renderer'
import { Provider } from 'react-redux'
import { ThemeBtn, LangBtn } from '../../Components'
import { Logo } from '../../images'
import configureStore from 'redux-mock-store'
const mockStore = configureStore([])
const store = mockStore({ contacts: [] })

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

describe('Auth Pages Component', () => {
  const component = create(
    <Provider store={store}>
      <AuthPage />
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
