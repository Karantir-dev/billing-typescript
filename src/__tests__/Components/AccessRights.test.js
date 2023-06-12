import '@testing-library/jest-dom'
import { mockedAxiosInstance } from '../../config/axiosInstance'

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

describe('Render Rights Lists', () => {
  test('Render list', async () => {
    const baseList = []
    baseList.fill({ name: { $: 'testName' } }, 0, 20)

    // const newList = await waitFor(async () => {
    //   screen.getByRole('list')
    // })

    // expect(newList.length).toEqual(2)

    // const { getAllByRole } = within(newList)
    // const items = getAllByRole('listitem')

    // expect(items.length).toBe(20)
  })
})
