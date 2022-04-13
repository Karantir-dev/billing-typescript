import React from 'react'
import { create } from 'react-test-renderer'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { SignupForm, Button } from '../../Components'
import { Routes, Route, BrowserRouter, Link } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import entireStore from '../../Redux/store'
import ReCAPTCHA from 'react-google-recaptcha'

import i18n from '../../i18n'
// const mockedNavigator = jest.fn()

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

  test('Component have 5 inputs', () => {
    const input = root.findAllByType('input')
    expect(input).toHaveLength(5)
  })

  test('Component have 1 links', () => {
    const links = root.findAllByType(Link)
    expect(links).toHaveLength(1)
  })

  test('Component have 1 Button', () => {
    const button = root.findAllByType(Button)
    expect(button).toHaveLength(1)
  })

  test('Component have captcha', () => {
    const captcha = root.findAllByType(ReCAPTCHA)
    expect(captcha).toHaveLength(1)
  })

  test('rendering and submitting a basic Formik form', async () => {
    const handleSubmit = jest.fn()
    render(
      <Provider store={entireStore.store}>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <Routes>
              <Route path="*" element={<SignupForm onSubmit={handleSubmit} />} />
            </Routes>
          </BrowserRouter>
        </I18nextProvider>
      </Provider>,
    )
    const user = userEvent.setup()

    let name = screen.getByTestId('input_name')
    let email = screen.getByTestId('input_email')
    let password = screen.getByTestId('input_password')
    let passConfirmation = screen.getByTestId('input_passConfirmation')

    await user.type(name, 'John')
    await user.type(email, 'john.dee@someemail.com')
    await user.type(password, 'test123')
    await user.type(passConfirmation, 'test123')

    await user.click(screen.getByTestId('btn_form_submit'))

    expect(name.value).toMatch('John')
    expect(email.value).toMatch('john.dee@someemail.com')
    expect(password.value).toMatch('test123')
    expect(passConfirmation.value).toMatch('test123')

    // await waitFor(() =>
    //   expect(handleSubmit).toHaveBeenCalledWith({
    //     name: 'John',
    //     email: 'john.dee@someemail.com',
    //     password: 'test123',
    //     passConfirmation: 'test123',
    //   }),
    // )
  })
})
