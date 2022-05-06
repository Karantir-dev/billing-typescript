import React from 'react'
import '@testing-library/jest-dom'
import { render, within, waitFor, screen } from '@testing-library/react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import entireStore from '../../Redux/store'
import { Provider } from 'react-redux'
import { mockedAxiosInstance } from '../../config/axiosInstance'
import AccessRights from '../../Components/TrustedUsers/AccessRights/AccessRights'

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

const baseList = []
baseList.fill({ name: { $: 'testName' } }, 0, 20)

mockedAxiosInstance.onPost('/').reply(200, {
  doc: { elem: baseList },
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

    const newList = await waitFor(async () => {
      screen.getByRole('list')
    })

    // expect(newList.length).toEqual(2)

    // const { getAllByRole } = within(newList)
    // const items = getAllByRole('listitem')

    // expect(items.length).toBe(20)
  })
})
