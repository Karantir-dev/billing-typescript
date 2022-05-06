import React from 'react'
import { create } from 'react-test-renderer'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import entireStore from '../../Redux/store'
import userEvent from '@testing-library/user-event'

import i18n from '../../i18n'
import { Button, TrustedUsers } from '../../Components'
import { mockedAxiosInstance } from '../../config/axiosInstance'

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

  test('Component has two Buttons (one is hidden in form)', async () => {
    const button = await root.findAllByType(Button)
    expect(button).toHaveLength(2)
  })

  test('Component will open form if btn add clicked', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()

    await mockedAxiosInstance.onPost('/').reply(200, {
      doc: { elem: [] },
    })

    render(
      <Provider store={entireStore.store}>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <Routes>
              <Route path="*" element={<TrustedUsers onClick={handleClick} />} />
            </Routes>
          </BrowserRouter>
        </I18nextProvider>
      </Provider>,
    )

    await user.click(screen.getByTestId('trusted_form_btn'))
    let form = await screen.getByTestId('trusted_form')
    expect(form).toBeVisible()
  })
})
