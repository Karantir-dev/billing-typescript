import React from 'react'
import { create } from 'react-test-renderer'
import { Provider, useSelector } from 'react-redux'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import entireStore from '../../Redux/store'

import i18n from '../../i18n'
import { Button, TrustedUsers } from '../../Components'
import UserCard from '../../Components/TrustedUsers/UserCard/UserCard'
import { usersSelectors } from '../../Redux/users/usersSelectors'

describe('TrustedUsers Component', () => {
  const component = create(
    <Provider store={entireStore.store}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<TrustedUsers />}></Route>
          </Routes>
        </BrowserRouter>
      </I18nextProvider>
    </Provider>,
  )
  const root = component.root
  jest.mock('react-redux')

  test('Component has one Button', async () => {
    const button = await root.findAllByType(Button)
    expect(button).toHaveLength(1)
  })

  test('Component has at least one card', async () => {
    const cards = await root.findAllByType(UserCard)
    expect(cards.length).toBeGreaterThanOrEqual(1)
  })

  test('Get users from server', async () => {
    const users = useSelector(usersSelectors.getUsers)

    expect(Array.isArray(users)).toBe(true)
  })
})
