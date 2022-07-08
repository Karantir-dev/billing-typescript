import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import * as redux from 'react-redux'
import entireStore from '../../Redux/store'
// import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { mockedAxiosInstance } from '../../config/axiosInstance'
import AccessRightsListItem from '../../Components/TrustedUsers/AccessRights/AccessRightsListItem/AccessRightsListItem'
import userEvent from '@testing-library/user-event'

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

describe('Render AccessRightsListItem', () => {
  render(
    <Provider store={entireStore.store}>
      <BrowserRouter>
        <Routes>
          <Route
            path="*"
            element={
              <AccessRightsListItem
                item={{
                  active: { $: 'on' },
                  name: { $: 'name' },
                  hassubitem: { $: 'on' },
                }}
                userId="1"
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </Provider>,
  )

  test('Render list items', async () => {
    const user = userEvent.setup()
    let listItem = screen.getByTestId('modal_rihgts_list_item')
    expect(screen.queryByTestId('modal_rihgts_list_item')).toBeInTheDocument()

    await user.click(listItem)
    let listSubItem = screen.getByTestId('modal_rihgts_sub_list')
    expect(listSubItem).toBeInTheDocument()
  })
})
