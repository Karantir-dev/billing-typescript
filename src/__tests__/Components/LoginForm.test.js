import React from 'react'
import { create, act } from 'react-test-renderer'
import { Provider } from 'react-redux'
import { LoginForm, Button } from '../../Components'
import { Routes, Route, BrowserRouter, Link } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import entireStore from '../../Redux/store'
import ReCAPTCHA from 'react-google-recaptcha'

import i18n from '../../i18n'

describe('Login Component', () => {
  const component = create(
    <Provider store={entireStore.store}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<LoginForm />}></Route>
          </Routes>
        </BrowserRouter>
      </I18nextProvider>
    </Provider>,
  )
  const root = component.root

  const tree = mount(
    <Provider store={entireStore.store}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<LoginForm />} />
          </Routes>
        </BrowserRouter>
      </I18nextProvider>
    </Provider>,
  )

  test('Component have 3 inputs', () => {
    const input = root.findAllByType('input')
    expect(input).toHaveLength(3)
  })

  test('Component have 2 links', () => {
    const links = root.findAllByType(Link)
    expect(links).toHaveLength(2)
  })

  test('Component have 1 Button', () => {
    const button = root.findAllByType(Button)
    expect(button).toHaveLength(2)
  })

  test('Component have captcha', () => {
    const captcha = root.findAllByType(ReCAPTCHA)
    expect(captcha).toHaveLength(1)
  })

  test('should update email field on change', async () => {
    const emailInput = await tree.find('input[name=\'email\']')
    act(() => {
      emailInput.simulate('change', {
        persist: () => {},
        target: {
          name: 'email',
          value: 'test@test.test',
        },
      })
    })
    expect(emailInput.html()).toMatch('test@test.test')
  })

  test('should update password field on change', async () => {
    const passwordInput = await tree.find('input[name=\'password\']')
    act(() => {
      passwordInput.simulate('change', {
        persist: () => {},
        target: {
          name: 'password',
          value: 'test123',
        },
      })
    })
    expect(passwordInput.html()).toMatch('test123')
  })
})
