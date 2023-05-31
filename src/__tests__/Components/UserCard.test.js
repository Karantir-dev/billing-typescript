import { create } from 'react-test-renderer'
import { Provider } from 'react-redux'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import entireStore from '../../Redux/store'
import { render, screen, fireEvent } from '@testing-library/react'

import i18n from '../../i18n'
import { Toggle } from '../../Components/'
import UserCard from '../../Components/TrustedUsers/UserCard/UserCard'
import ControlBtn from '../../Components/TrustedUsers/ControlBtn/ControlBtn'
import { mockedAxiosInstance } from '../../config/axiosInstance'

describe('UserCard Component', () => {
  const component = create(
    <Provider store={entireStore.store}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<UserCard />}></Route>
          </Routes>
        </BrowserRouter>
      </I18nextProvider>
    </Provider>,
  )
  const root = component.root

  test('Component has 2  ToggleButton components', async () => {
    const toggleBtns = await root.findAllByType(Toggle)
    expect(toggleBtns).toHaveLength(2)
  })

  test('Component has 1 ControlBtn component', async () => {
    const controlBtns = await root.findAllByType(ControlBtn)
    expect(controlBtns).toHaveLength(1)
  })

  mockedAxiosInstance.onPost('/').reply(200, {
    doc: {
      elem: [
        {
          active: { $: 'on' },
          hassubitems: { $: 'on' },
          name: { $: 'services.autoprolong' },
        },
      ],
    },
  })

  beforeEach(() => {
    render(
      <Provider store={entireStore.store}>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <Routes>
              <Route path="*" element={<UserCard />} />
            </Routes>
          </BrowserRouter>
        </I18nextProvider>
      </Provider>,
    )
  })

  test('setAreControlDotsActive should be as true and render list', async () => {
    const button = await screen.getByTestId('controlBtn_testId')
    expect(screen.getByTestId('controlBtn_testId')).toBeInTheDocument()
    fireEvent.click(button)
    expect(screen.getByTestId('controlBtn_dropdown_testId')).toBeInTheDocument()
  })

  // test('setIsSuccessAlertOpened should be as true and render status alert', async () => {
  //   const buttonSetAlert = await screen.getByTestId('alert_controlBtn_test_status')
  //   expect(buttonSetAlert).toBeInTheDocument()
  //   fireEvent.click(buttonSetAlert)
  //   expect(screen.getByTestId('trusted_users_alert_status')).toBeInTheDocument()
  // })

  // test('setIsSuccessAlertOpened access should be as true and render access alert', async () => {
  //   const buttonSetAlert = await screen.getByTestId('alert_controlBtn_test_access')
  //   expect(buttonSetAlert).toBeInTheDocument()
  //   fireEvent.click(buttonSetAlert)
  //   expect(screen.getByTestId('trusted_users_alert_access')).toBeInTheDocument()
  // })
})
