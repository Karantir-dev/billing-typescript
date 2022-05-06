import React from 'react'
import { create } from 'react-test-renderer'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { Button } from '../../Components'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import entireStore from '../../Redux/store'
import ManageUserForm from '../../Components/TrustedUsers/ManageUserForm/ManageUserForm'
import { mockedAxiosInstance } from '../../config/axiosInstance'

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: str => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    }
  },
  initReactI18next: { type: '3rdParty', init: jest.fn() },
}))

describe('AddUserForm Component', () => {
  const component = create(
    <Provider store={entireStore.store}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<ManageUserForm />}></Route>
        </Routes>
      </BrowserRouter>
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

    await mockedAxiosInstance.onPost('/').reply(200, { doc: {} })

    render(
      <Provider store={entireStore.store}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<ManageUserForm onSubmit={handleSubmit} />} />
          </Routes>
        </BrowserRouter>
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
