import React from 'react'
import { create, act } from 'react-test-renderer'
import { Provider } from 'react-redux'
import { SignupForm, Button } from '../../Components'
import { Routes, Route, BrowserRouter, Link } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import entireStore from '../../Redux/store'
import ReCAPTCHA from 'react-google-recaptcha'

import i18n from '../../i18n'

const mockedNavigator = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => ({
    navigate: jest.fn().mockImplementation(() => ({})),
  }),
}))

describe('Register Component', () => {
  const component = create(
    <Provider store={entireStore.store}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<SignupForm />}></Route>
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
            <Route path="*" element={<SignupForm />} />
          </Routes>
        </BrowserRouter>
      </I18nextProvider>
    </Provider>,
  )

  test('Component have 5 inputs', async () => {
    const input = await root.findAllByType('input')
    expect(input).toHaveLength(5)
  })

  test('Component have 1 links', async () => {
    const links = await root.findAllByType(Link)
    expect(links).toHaveLength(1)
  })

  test('Component have 1 Button', async () => {
    const button = await root.findAllByType(Button)
    expect(button).toHaveLength(1)
  })

  test('Component have captcha', async () => {
    const captcha = await root.findAllByType(ReCAPTCHA)
    expect(captcha).toHaveLength(1)
  })

  test('should update email field on change', async () => {
    const emailInput = await tree.find("input[name='email']")
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
    const passwordInput = await tree.find("input[name='password']")
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

  test('should update passConfirmation field on change', async () => {
    const passConfirmationInput = await tree.find("input[name='passConfirmation']")
    act(() => {
      passConfirmationInput.simulate('change', {
        persist: () => {},
        target: {
          name: 'passConfirmation',
          value: 'test123',
        },
      })
    })
    expect(passConfirmationInput.html()).toMatch('test123')
  })

  test('should update name field on change', async () => {
    const name = await tree.find("input[name='name']")
    act(() => {
      name.simulate('change', {
        persist: () => {},
        target: {
          name: 'name',
          value: 'test123',
        },
      })
    })
    expect(name.html()).toMatch('test123')
  })
})
