import '@testing-library/jest-dom'
// import { screen } from '@testing-library/react'
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

mockedAxiosInstance.onPost('/').reply(200, {
  doc: { elem: [] },
})

describe('Render AccessRightsAlert', () => {
  test('Render modal window', () => {
    // const rightsAlert = screen.getByTestId('trusted_users_rights_alert')
    // const lists = screen.getAllByTestId('trusted_users_rights_list')
    // expect(lists).toHaveLength(1)
    // expect(rightsAlert).toBeInTheDocument()
  })

  //   test('Close modal window', async () => {
  //     const user = userEvent.setup()

  //     let button = screen.getByTestId('trusted_users_rights_btn')
  //     await user.click(button)
  //     expect(screen.queryByTestId('trusted_users_rights_alert')).not.toBeVisible()
  //   })
})
