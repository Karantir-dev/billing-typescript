import { useEffect, useState } from 'react'
import { cookies, useTrustpilot } from '@utils'
import { useDispatch, useSelector } from 'react-redux'
import { billingOperations, billingSelectors } from '@redux'
import axios from 'axios'

export default function useAnalyticsSender() {
  const dispatch = useDispatch()

  const { sendEmail } = useTrustpilot()

  const paymentId = cookies.getCookie('payment_id') // payment ID, obtained during the transition to the payment system

  const paymentsList = useSelector(billingSelectors.getPaymentsList) // list of all user payments

  const [paymentItem, setPaymentItem] = useState(null)
  const [cartData, setCartData] = useState(null)

  useEffect(() => {
    const data = { p_num: 1, p_cnt: 15, status: '' }
    dispatch(billingOperations.setPaymentsFilters(data))
  }, [])

  useEffect(() => {
    // in the list of payments we look for the necessary payment
    if (paymentsList && paymentsList?.length > 0) {
      const existingPaymentItem = paymentsList?.find(
        payment => payment?.id?.$ === paymentId,
      )

      if (existingPaymentItem) {
        setPaymentItem(existingPaymentItem) // write down the payment data

        if (existingPaymentItem?.billorder) {
          //if the billorder field is present in the payment, then this is a purchase through the basket
          const data = cookies.getCookie(`cartData_${paymentId}`)
          // check whether we have such a basket saved (baskets are stored for 5 days from the moment of its creation)
          if (data) {
            //if we find such a basket, then we save
            const dataJson = JSON.parse(data)
            setCartData(dataJson)
          }
        }
      }
    }
  }, [paymentsList])

  useEffect(() => {
    if (paymentItem) {
      //if we have payment
      let value = Number(paymentItem?.subaccountamount_iso?.$.replace('EUR', ''))
      let tax = Number(paymentItem?.tax?.$.replace('EUR', ''))

      window?.dataLayer?.push({ ecommerce: null }) //clean data layer ecommerce

      let analyticsData = {
        event: 'purchase',
        ecommerce: {
          payment_type: paymentItem?.paymethod_name?.$,
          transaction_id: paymentId,
          affiliation: window.location.hostname,
          value: value || 0,
          tax: tax || 0,
          currency: 'EUR',
          shipping: '0',
          coupon: '',
          items: [
            {
              item_name: 'Service',
              item_id: 'lost_data',
              price: 0,
              item_category: 'lost_data',
              quantity: 0,
            },
          ],
        },
      }

      const fbAnalytics = {
        value: value,
        currency: 'EUR',
        content_type: 'Service',
        content_category: 'lost_data',
      }

      // If it is a purchase of services
      if (paymentItem?.billorder) {
        // If there is saved product data
        if (cartData?.billorder === paymentItem?.billorder?.$) {
          analyticsData.ecommerce.coupon = cartData?.promocode
          analyticsData.ecommerce.items = cartData?.items
        }

        // checks if the GTM is already loaded and sends analytics
        if (window.dataLayer?.find(el => el['gtm.start'])) {
          window?.dataLayer?.push(analyticsData)
          axios.post(`${process.env.REACT_APP_API_URL}/api/analytic/add/`, analyticsData)

          if (window.fbq) {
            fbAnalytics.contents = cartData?.items?.map(el => ({
              id: el.item_id,
              quantity: 1,
              name: el.item_name,
              price: el.price,
            }))
            fbAnalytics.content_category = cartData?.items?.[0]?.item_category

            window.fbq('track', 'Purchase', fbAnalytics)
          }
          if (window.qp) window.qp('track', 'Purchase', { value: value })

          /** Sends Trustpilot email  */
          if (cartData?.items?.[0]?.item_category === 'dedic') {
            sendEmail(cartData.billorder)
          }

          // if the GTM is absent we add extra field to the front analytics
        } else {
          analyticsData.gtm_absent = true

          axios.post(`${process.env.REACT_APP_API_URL}/api/analytic/add/`, analyticsData)
        }

        cookies.eraseCookie(`cartData_${paymentId}`)

        // If it is a balance replenishment (we don`t have saved product data)
      } else {
        if (!cartData) {
          analyticsData.ecommerce.items = [
            {
              item_name: 'Refill',
              price: value || 0,
              item_category: 'Refill',
              quantity: 1,
            },
          ]
          fbAnalytics.content_category = 'Refill'
          fbAnalytics.content_type = 'Refill'
          fbAnalytics.content_ids = [paymentId]

          // checks if the GTM is already loaded and sends analytics
          if (window.dataLayer?.find(el => el['gtm.start'])) {
            window?.dataLayer?.push(analyticsData)
            axios.post(
              `${process.env.REACT_APP_API_URL}/api/analytic/add/`,
              analyticsData,
            )

            if (window.fbq) {
              window.fbq('track', 'Purchase', fbAnalytics)
            }
            if (window.qp) window.qp('track', 'Purchase', { value: value })
          } else {
            analyticsData.gtm_absent = true

            axios.post(
              `${process.env.REACT_APP_API_URL}/api/analytic/add/`,
              analyticsData,
            )
          }
        }
      }

      cookies.eraseCookie('payment_id') // if the payment id was used, then clear it
    }
  }, [paymentItem])
}
