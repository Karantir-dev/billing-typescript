import React from 'react'
import { create } from 'react-test-renderer'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import entireStore from '../../Redux/store'

import i18n from '../../i18n'
import { Button, TrustedUsers } from '../../Components'

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

  test('Component has one Button', async () => {
    const button = await root.findAllByType(Button)
    expect(button).toHaveLength(1)
  })

  test('Component will open form if btn add clicked', async () => {
    const handleClick = jest.fn()

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

    let buttonAdd = screen.getByTestId('trusted_form_btn')
    await fireEvent.click(buttonAdd)
    let form = await screen.getByTestId('trusted_form')
    expect(form).toBeDefined()
  })
})
