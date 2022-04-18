import React from 'react'
import { create } from 'react-test-renderer'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { Button } from '../../Components'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import entireStore from '../../Redux/store'
import i18n from '../../i18n'
import AddUserForm from '../../Components/TrustedUsers/AddUserForm/AddUserForm'

describe('AddUserForm Component', () => {
  const component = create(
    <Provider store={entireStore.store}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<AddUserForm />}></Route>
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

  test('Component have 1 Button', () => {
    const button = root.findAllByType(Button)
    expect(button).toHaveLength(1)
  })

  test('rendering and submitting creatingUserForm (Formik)', async () => {
    const handleSubmit = jest.fn()

    render(
      <Provider store={entireStore.store}>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <Routes>
              <Route path="*" element={<AddUserForm onSubmit={handleSubmit} />} />
            </Routes>
          </BrowserRouter>
        </I18nextProvider>
      </Provider>,
    )
    const user = userEvent.setup()

    let email = screen.getByTestId('input_email')
    let name = screen.getByTestId('input_name')
    let password = screen.getByTestId('input_password')
    let passConfirmation = screen.getByTestId('input_passConfirmation')

    user.type(name, 'John')
    user.type(email, 'john.dee@someemail.com')
    user.type(password, 'test123')
    user.type(passConfirmation, 'test123')

    user.click(screen.getByTestId('btn_form_submit'))

    waitFor(() =>
      expect(handleSubmit).toHaveBeenCalledWith({
        name: 'John',
        email: 'john.dee@someemail.com',
        password: 'test123',
        passConfirmation: 'test123',
      }),
    )
  })
})
