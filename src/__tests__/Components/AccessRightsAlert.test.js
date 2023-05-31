import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import entireStore from '../../Redux/store'
// import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { mockedAxiosInstance } from '../../config/axiosInstance'
import AccessRightsAlert from '../../Components/TrustedUsers/AccessRightsAlert/AccessRightsAlert'

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

mockedAxiosInstance.onPost('/').reply(200, {
  doc: { elem: [] },
})

function renderComponent() {
  render(
    <Provider store={entireStore.store}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<AccessRightsAlert />} />
        </Routes>
      </BrowserRouter>
    </Provider>,
  )
}

describe('Render AccessRightsAlert', () => {
  beforeEach(() => {
    renderComponent()
  })

  test('Render modal window', () => {
    const rightsAlert = screen.getByTestId('trusted_users_rights_alert')
    const lists = screen.getAllByTestId('trusted_users_rights_list')
    expect(lists).toHaveLength(1)
    expect(rightsAlert).toBeInTheDocument()
  })

  //   test('Close modal window', async () => {
  //     const user = userEvent.setup()

  //     let button = screen.getByTestId('trusted_users_rights_btn')
  //     await user.click(button)
  //     expect(screen.queryByTestId('trusted_users_rights_alert')).not.toBeVisible()
  //   })
})
