import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import entireStore from '../../Redux/store'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { AboutAffiliateProgram } from '../../Pages'
import { Context as ResponsiveContext } from 'react-responsive'
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
}))

describe('AboutAffiliateProgram Page jsx', () => {
  beforeAll(() => {
    mockedAxiosInstance.onPost('/').reply(200, {
      doc: { url: { $: 'url string' }, promocode: { $: 'promocode' } },
    })
  })

  beforeEach(() => {
    render(
      <Provider store={entireStore.store}>
        <BrowserRouter>
          <ResponsiveContext.Provider value={{ width: 1920 }}>
            <AboutAffiliateProgram />
          </ResponsiveContext.Provider>
        </BrowserRouter>
      </Provider>,
    )
  })

  test('descktop', () => {
    // expect(screen.getByTestId('descktop_banner')).toBeInTheDocument()
    screen.getByText('about_section_title')
  })

  test('mobile', () => {
    screen.getByText('about_section_title')
  })
})
