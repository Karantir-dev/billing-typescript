import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Route, MemoryRouter, Routes } from 'react-router-dom'
import OpenedTicket from '../../Pages/SupportPage/OpenedTicket/OpenedTicket'
import { SupportPage } from '../../Pages'
import {
  SupportTable,
  SupportArchiveTable,
  SendMessageForm,
  SupportFilter,
} from '../../Components'
import * as redux from 'react-redux'
import entireStore from '../../Redux/store'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { mockedAxiosInstance } from '../../config/axiosInstance'

jest.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: jest.fn() },
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

// describe('Support Page jsx', () => {
//   function renderComponent(path) {
//     render(
//       <Provider store={entireStore.store}>
//         <MemoryRouter initialEntries={[`/support/${path}`]}>
//           <Routes>
//             <Route path="/support/:path" element={<SupportPage />} />
//           </Routes>
//         </MemoryRouter>
//       </Provider>,
//     )
//   }

//   test('render support requests', () => {
//     renderComponent('requests')
//     expect(screen.queryByTestId('request_support')).toBeInTheDocument()
//   })

//   test('render support archive requests', () => {
//     renderComponent('requests_archive')
//     expect(screen.queryByTestId('request_archive')).toBeInTheDocument()
//   })
// })

describe('Opened Ticket jsx', () => {
  function renderComponent(path) {
    render(
      <Provider store={entireStore.store}>
        <MemoryRouter initialEntries={[`/support/${path}/1`]}>
          <Routes>
            <Route path="/support/:path/:id" element={<OpenedTicket />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    )
  }

  test('render support requests', () => {
    const spy = jest.spyOn(redux, 'useSelector')
    spy.mockReturnValue({
      userTickets: [],
      closed_ticket_user: { $: 'on' },
      mlist: [
        {
          fm_date_post: { $: '14 Apr 2022' },
          message: [{ $type: 'info', rowgroup: [{ row: [{ $: '' }] }] }],
        },
      ],
    })

    renderComponent('requests')
    expect(screen.queryByTestId('back_btn')).toBeInTheDocument()
  })
})

describe('Support table jsx', () => {
  function renderComponent(path) {
    render(
      <Provider store={entireStore.store}>
        <MemoryRouter initialEntries={[`/support/${path}`]}>
          <Routes>
            <Route
              path="/support/:path"
              element={
                <SupportTable
                  list={[
                    {
                      tstatus: { $: 'test' },
                      last_message: { $: '' },
                      name: { $: 'test' },
                      id: { $: '1' },
                      unread: { $: 'on' },
                    },
                  ]}
                />
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>,
    )
  }

  test('render support requests', () => {
    renderComponent('requests')
    expect(screen.queryByTestId('request_item')).toBeInTheDocument()
  })
})

describe('Support Archive table jsx', () => {
  function renderComponent(path) {
    render(
      <Provider store={entireStore.store}>
        <MemoryRouter initialEntries={[`/support/${path}`]}>
          <Routes>
            <Route
              path="/support/:path"
              element={
                <SupportArchiveTable
                  list={[
                    {
                      tstatus: { $: 'test' },
                      last_message: { $: '' },
                      name: { $: 'test' },
                      id: { $: '1' },
                      unread: { $: 'on' },
                    },
                  ]}
                />
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>,
    )
  }

  test('render support requests', () => {
    renderComponent('requests_archive')
    expect(screen.queryByTestId('archive_item')).toBeInTheDocument()
  })
})

describe('Send message form', () => {
  function renderComponent(path) {
    render(
      <Provider store={entireStore.store}>
        <MemoryRouter initialEntries={[`/support/${path}/1`]}>
          <Routes>
            <Route path="/support/:path/:id" element={<SendMessageForm />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    )
  }

  test('render support requests', async () => {
    renderComponent('requests')
    const user = userEvent.setup()

    let message = screen.getByTestId('input_message')

    await user.type(message, 'test123243')

    await user.click(screen.getByTestId('btn_form_submit'))

    expect(message.value).toMatch('')
  })
})

describe('Filter modal form', () => {
  function renderComponent(path) {
    render(
      <Provider store={entireStore.store}>
        <MemoryRouter initialEntries={[`/support/${path}`]}>
          <Routes>
            <Route path="/support/:path" element={<SupportFilter />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    )
  }

  test('render support filter', async () => {
    renderComponent('requests')
    expect(screen.queryByTestId('archiveBtn')).toBeInTheDocument()
    expect(screen.queryByTestId('new_ticket_btn')).toBeInTheDocument()
  })
})
