import { create } from 'react-test-renderer'
import { Provider } from 'react-redux'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import entireStore from '@redux/store'
import { render, screen, fireEvent } from '@testing-library/react'

import i18n from '@src/i18n'
import ControlBtn from '@components/TrustedUsers/ControlBtn/ControlBtn'

describe('ControlBtn Component', () => {
  const component = create(
    <Provider store={entireStore.store}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<ControlBtn />}></Route>
          </Routes>
        </BrowserRouter>
      </I18nextProvider>
    </Provider>,
  )
  const root = component.root

  test('Component has 7 buttons tags', async () => {
    const buttons = await root.findAllByType('button')
    expect(buttons).toHaveLength(7)
  })

  beforeEach(() => {
    render(
      <Provider store={entireStore.store}>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <Routes>
              <Route path="*" element={<ControlBtn />} />
            </Routes>
          </BrowserRouter>
        </I18nextProvider>
      </Provider>,
    )
  })

  // test('When control OK button is clicked, aleret is shown', async () => {
  //   const button = await screen.getByTestId('alert_removeuser_test_status')
  //   expect(button).toBeInTheDocument()

  //   fireEvent.click(button)
  //   expect(screen.getByTestId('trusted_users_alert_remove')).toBeInTheDocument()
  // })

  test('When control btn is clicked, dropdown list is shown', () => {
    const button = screen.getByTestId('controlBtn_testId')
    expect(button).toBeInTheDocument()
    fireEvent.click(button)
    expect(screen.getByTestId('controlBtn_dropdown_testId')).toBeInTheDocument()
  })
})
