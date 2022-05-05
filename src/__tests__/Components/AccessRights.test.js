import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import entireStore from '../../Redux/store'
// import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { mockedAxiosInstance } from '../../config/axiosInstance'
import AccessRights from '../../Components/TrustedUsers/AccessRights/AccessRights'
// import AccessRightsListItem from '../../Components/TrustedUsers/AccessRights/AccessRightsListItem/AccessRightsListItem'
// import { create } from 'react-test-renderer'

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: str => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    }
  },
}))

mockedAxiosInstance.onPost('/').reply(200, {
  doc: { elem: [] },
})

function renderComponent(fakeList) {
  render(
    <Provider store={entireStore.store}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<AccessRights items={fakeList} />} />
        </Routes>
      </BrowserRouter>
    </Provider>,
  )
}

describe('Render Rights Lists', () => {
  test('Render list', async () => {
    const baseList = []
    baseList.fill({ name: { $: 'testName' } }, 0, 20)

    renderComponent(baseList)

    // const res = await waitFor(async () => {
    //   screen.getByRole('list')

    //   return await screen.getByTestId('trusted_users_rights_item')
    // })

    // expect(res.length).toEqual(2)

    // const { getAllByRole } = within(newList)
    // const items = getAllByRole('listitem')
    // expect(items.length).toBe(20)
  })
})
