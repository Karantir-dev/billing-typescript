// import '@testing-library/jest-dom'
// import { render, screen } from '@testing-library/react'
// import entireStore from '../../Redux/store'
// import { BrowserRouter } from 'react-router-dom'
// import { Provider } from 'react-redux'
// import { AffiliateProgramIncome } from '../../Pages'
import { mockedAxiosInstance } from '@config/axiosInstance'
// import userEvent from '@testing-library/user-event'
import qs from 'qs'

// jest.mock('react-i18next', () => ({
//   useTranslation: () => {
//     return {
//       t: str => str,
//       i18n: {
//         changeLanguage: () => new Promise(() => {}),
//       },
//     }
//   },
// }))

// function renderComponent() {
//   render(
//     <Provider store={entireStore.store}>
//       <BrowserRouter>
//         <AffiliateProgramIncome />
//       </BrowserRouter>
//     </Provider>,
//   )
// }

describe('AffiliateProgramIncome Page jsx', () => {
  beforeAll(() => {
    mockedAxiosInstance
      .onPost(
        '/',
        qs.stringify({
          func: 'affiliate.client.reward',
          auth: '',
          out: 'json',
        }),
      )
      .reply(200, {
        doc: {
          period: { $: 'currentyear' },
          slist: [
            {
              val: [
                { $key: 'currentyear', $: 'current year' },
                { $key: 'today', $: 'current day' },
                { $key: 'currentweek', $: 'current week' },
              ],
            },
          ],
          reportdata: {
            reward: {
              elem: [
                { amount: { $id: '2022-01-01', $: '21.01 EUR' } },
                { amount: { $id: '2022-02-01', $: '18.42 EUR' } },
              ],
            },
          },
        },
      })
  })

  test('report generation (select period, click search btn, click day details)', async () => {
    // renderComponent()
    // const user = userEvent.setup()
    // await user.click(screen.getByTestId('period_select'))
    // await user.click(screen.getByTestId('qwe0'))
    // expect(screen.findByTestId('wrapper')).toBeInTheDocument()
  })
})
