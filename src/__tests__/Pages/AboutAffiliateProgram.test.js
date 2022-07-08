import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import entireStore from '../../Redux/store'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { AboutAffiliateProgram } from '../../Pages'
import { Context as ResponsiveContext } from 'react-responsive'
import { mockedAxiosInstance } from '../../config/axiosInstance'
import userEvent from '@testing-library/user-event'

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

function renderComponent(width) {
  render(
    <Provider store={entireStore.store}>
      <BrowserRouter>
        <ResponsiveContext.Provider value={{ width }}>
          <AboutAffiliateProgram />
        </ResponsiveContext.Provider>
      </BrowserRouter>
    </Provider>,
  )
}

describe('AboutAffiliateProgram Page jsx', () => {
  beforeAll(() => {
    mockedAxiosInstance.onPost('/').reply(200, {
      doc: { url: { $: 'url string' }, promocode: { $: 'promocode' } },
    })
  })

  test('descktop render without btn_more and mobile banner', () => {
    renderComponent(1920)

    expect(screen.getByTestId('descktop_banner')).toBeInTheDocument()
    expect(screen.queryByText('read_more')).toBeNull()
    expect(screen.queryByTestId('mobile_banner')).toBeNull()
  })

  test('mobile render with btn_more and mobile banner', () => {
    renderComponent(767)

    expect(screen.getByText('read_more')).toBeInTheDocument()
    expect(screen.getByTestId('mobile_banner')).toBeInTheDocument()
    expect(screen.queryByTestId('descktop_banner')).toBeNull()
  })

  test('promo code copying', async () => {
    renderComponent(767)

    const user = userEvent.setup()

    expect(screen.queryByText('about_section.promocode_copied')).toBeNull()
    await user.click(screen.getByTestId('promocode_field'))
    screen.getByText('about_section.promocode_copied')
  })

  test('referral link generation & refferal link copying', async () => {
    renderComponent(767)

    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: 'service_placeholder' }))
    expect(screen.getByTestId('services_dropdown')).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'vds' }))
    expect(screen.getByTestId('services_dropdown')).not.toBeVisible()
    expect(screen.getByTestId('custom_select').textContent).toBe('vds')

    expect(screen.queryByText('about_section.link_copied')).toBeNull()
    await user.click(screen.getByTestId('ref_link_field'))
    screen.getByText('about_section.link_copied')
  })
})
