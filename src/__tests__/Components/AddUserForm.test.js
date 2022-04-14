import React from 'react'
import { create } from 'react-test-renderer'
import { render, screen, fireEvent } from '@testing-library/react'
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

    let email = screen.getByTestId('input_email')
    let name = screen.getByTestId('input_name')
    let password = screen.getByTestId('input_password')
    let passConfirmation = screen.getByTestId('input_passConfirmation')

    fireEvent.change(email, { target: { value: 'john.dee@someemail.com' } })
    fireEvent.change(name, { target: { value: 'John' } })
    fireEvent.change(password, { target: { value: 'test123' } })
    fireEvent.change(passConfirmation, { target: { value: 'test123' } })

    expect(email.value).toMatch('john.dee@someemail.com')
    expect(name.value).toMatch('John')
    expect(password.value).toMatch('test123')
    expect(passConfirmation.value).toMatch('test123')
  })
})
