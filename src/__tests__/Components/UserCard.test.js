import React from 'react'
import { create } from 'react-test-renderer'
import { Provider } from 'react-redux'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import entireStore from '../../Redux/store'
import { render, screen, fireEvent } from '@testing-library/react'

import i18n from '../../i18n'
import { ToggleButton } from '../../Components'
import UserCard from '../../Components/TrustedUsers/UserCard/UserCard'
import ControlBtn from '../../Components/TrustedUsers/ControlBtn/ControlBtn'

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
    const toggleBtns = await root.findAllByType(ToggleButton)
    expect(toggleBtns).toHaveLength(2)
  })

  test('Component has 1 ControlBtn component', async () => {
    const controlBtns = await root.findAllByType(ControlBtn)
    expect(controlBtns).toHaveLength(1)
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

  it('should setAreControlDotsActive as false', () => {
    expect(screen.getByTestId('controlBtn_testId')).not.toBeInTheDocument()
  })
  // test('should setAreControlDotsActive as true when it clicked')

  // test('useStateHooks', async () => {
  //   render(
  //     <Provider store={entireStore.store}>
  //       <I18nextProvider i18n={i18n}>
  //         <BrowserRouter>
  //           <Routes>
  //             <Route path="*" element={<UserCard />} />
  //           </Routes>
  //         </BrowserRouter>
  //       </I18nextProvider>
  //     </Provider>,
  //   )
  // })
})
