import { API_URL } from '@src/config/config'
import { cookies } from '@utils'
import axios from 'axios'

export default function cryptoAnalyticsSender(orderInfo, paymentID) {
  const orderAmount = Number(orderInfo?.amount) || Number(orderInfo?.total_sum) || 0
  let items = [
    {
      item_name: 'Refill',
      item_id: paymentID,
      price: orderAmount,
      item_category: 'Refill',
      quantity: 1,
    },
  ]

  // if it is a service purchase
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
  }

  // if it is the cryptocurrency payment method - send analytics
  if (
    orderInfo?.paymethod_name?.includes('Coinify') ||
    orderInfo?.paymethod_name?.includes('Bitcoin')
  ) {
    const ecommerceData = {
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
    console.log('crypto method', ecommerceData)

    cookies.eraseCookie('payment_id')
    window?.dataLayer?.push({ ecommerce: null })
    window?.dataLayer?.push(ecommerceData)

    axios.post(`${API_URL}/api/analytic/add/`, ecommerceData)

    // if it is any other payment method - write down the order info into cookies
  } else {
    console.log('set paymentID', paymentID)
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
