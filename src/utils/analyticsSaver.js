import { cookies } from '@utils'
import axios from 'axios'

export default function analyticsSaver(orderInfo, paymentID) {
  const orderAmount = Number(orderInfo?.amount) || Number(orderInfo?.total_sum) || 0
  let items = [
    {
      item_name: 'Refill',
      price: orderAmount,
      item_category: 'Refill',
      quantity: 1,
    },
  ]
  const fbAnalytics = {
    value: orderAmount,
    currency: 'EUR',
    content_type: 'Refill',
    content_category: 'Refill',
    content_ids: [paymentID],
  }

  // if it is a service purchase - form analytics data
  if (orderInfo?.billorder) {
    items = orderInfo?.elemList?.map(e => {
      return {
        item_name: e.pricelist_name?.$ || '',
        item_id: e['item.id']?.$ || '',
        price: Number(e.cost?.$) || 0,
        item_category: e['item.type']?.$ || '',
        quantity: 1,
      }
    })
    fbAnalytics.content_type = 'Service'
    fbAnalytics.content_category = orderInfo?.elemList?.[0]?.['item.type']?.$

    fbAnalytics.contents = orderInfo?.elemList?.map(e => ({
      id: e['item.id']?.$,
      quantity: 1,
      name: e.pricelist_name?.$,
      price: Number(e.cost?.$),
    }))
  }

  // if it is the cryptocurrency payment method - send analytics
  if (
    orderInfo?.paymethod_name?.includes('Coinify') ||
    orderInfo?.paymethod_name?.includes('Bitcoin')
  ) {
    const analyticsData = {
      event: 'purchase',
      ecommerce: {
        payment_type: orderInfo?.paymethod_name,
        transaction_id: paymentID,
        affiliation: window.location.hostname,
        value: orderAmount,
        tax: Number(orderInfo?.tax) || 0,
        currency: 'EUR',
        shipping: '0',
        coupon: orderInfo?.promocode || '',
        items: items,
      },
    }

    cookies.eraseCookie('payment_id')

    // checks if the GTM is already loaded and sends analytics
    if (window.dataLayer?.find(el => el['gtm.start'])) {
      window?.dataLayer?.push({ ecommerce: null })
      window?.dataLayer?.push(analyticsData)
      if (window.fbq) {
        window.fbq('track', 'Purchase', fbAnalytics)
      }
      axios.post(`${process.env.REACT_APP_API_URL}/api/analytic/add/`, analyticsData)
    } else {
      analyticsData.gtm_absent = true
      axios.post(`${process.env.REACT_APP_API_URL}/api/analytic/add/`, analyticsData)
    }

    // if it is any other payment method - write down the order info into cookies
  } else {
    paymentID && cookies.setCookie('payment_id', paymentID, 5)

    if (orderInfo?.billorder) {
      cookies?.setCookie(
        `cartData_${paymentID}`,
        JSON.stringify({
          billorder: orderInfo?.billorder,
          promocode: orderInfo?.promocode || '',
          items: items,
        }),
        5,
      )
    }
  }
}
