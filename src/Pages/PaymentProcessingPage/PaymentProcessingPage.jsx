import { useEffect, useState } from 'react'
import s from './PaymentProcessingPage.module.scss'
import { Icon } from '@components'
import { useTranslation } from 'react-i18next'
import * as route from '../../routes'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { cookies } from '../../utils'
import { billingOperations, billingSelectors } from '../../Redux'

export default function PaymentSaved() {
  const { t } = useTranslation('other')
  const dispatch = useDispatch()

  const paymentId = cookies.getCookie('payment_id') // payment ID, obtained during the transition to the payment system

  const paymentsList = useSelector(billingSelectors.getPaymentsList) // list of all user payments

  const [paymentItem, setPaymentItem] = useState(null)
  const [cartData, setCartData] = useState(null)
  const [exchangeRate, setExchangeRate] = useState(null)

  useEffect(() => {
    dispatch(billingOperations?.getExchangeRate('rub', setExchangeRate))
  }, [])

  useEffect(() => {
    const data = { p_num: 1, p_cnt: 15 }
    dispatch(billingOperations.getPayments(data))
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
    if (paymentItem && exchangeRate) {
      //if we have payment
      let currency = paymentItem?.paymethodamount_iso?.$?.includes('RUB') ? 'RUB' : 'EUR' //check what currency used
      let value = paymentItem?.paymethodamount_iso?.$?.replace(currency, '') //get the payment amount
      let tax = paymentItem?.tax?.$?.replace(currency, '') //get the payment tax

      if (currency === 'RUB' && Number(exchangeRate) > 1) {
        value = (Number(value || 0) / Number(exchangeRate)).toFixed(2)
        tax = (Number(tax || 0) / Number(exchangeRate)).toFixed(2)
        currency = 'EUR'
      }

      window?.dataLayer?.push({ ecommerce: null }) //clean data layer ecommerce

      let ecommerce = null

      // If it is a purchase of services
      if (paymentItem?.billorder) {
        // If there is saved product data
        if (cartData?.billorder === paymentItem?.billorder?.$) {
          ecommerce = {
            event: 'purchase',
            ecommerce: {
              payment_type: paymentItem?.paymethod_name?.$,
              transaction_id: paymentId,
              affiliation: 'cp.zomro.com',
              value: Number(value) || 0,
              tax: Number(tax) || 0,
              currency: currency,
              shipping: '0',
              coupon: cartData?.promocode,
              items: cartData?.items,
            },
          }

          window?.dataLayer?.push(ecommerce)
          dispatch(billingOperations.analyticSendHandler(ecommerce))

          cookies.eraseCookie(`cartData_${paymentId}`)

          // If there is NO saved product data
        } else {
          ecommerce = {
            event: 'purchase',
            ecommerce: {
              payment_type: paymentItem?.paymethod_name?.$,
              transaction_id: paymentId,
              affiliation: 'cp.zomro.com',
              value: Number(value) || 0,
              tax: Number(tax) || 0,
              currency: currency,
              shipping: '0',
              coupon: '',
              items: [
                {
                  item_name: 'Service',
                  item_id: 'lost_data',
                  price: 0,
                  item_category: 'lost_data',
                  quantity: 1,
                },
              ],
            },
          }

          window?.dataLayer?.push(ecommerce)
          dispatch(billingOperations.analyticSendHandler(ecommerce))
        }

        // If it is a balance replenishment (we don`t have saved product data)
      } else {
        if (!cartData) {
          ecommerce = {
            event: 'purchase',
            ecommerce: {
              payment_type: paymentItem?.paymethod_name?.$,
              transaction_id: paymentId,
              affiliation: 'cp.zomro.com',
              value: Number(value) || 0,
              tax: Number(tax) || 0,
              currency: currency,
              items: [
                {
                  item_name: 'Refill',
                  item_id: paymentId,
                  price: Number(value) || 0,
                  item_category: 'Refill',
                  quantity: 1,
                },
              ],
            },
          }

          window?.dataLayer?.push(ecommerce)
          dispatch(billingOperations.analyticSendHandler(ecommerce))
        }
      }
      cookies.eraseCookie('payment_id') // if the payment id was used, then clear it
    }
  }, [paymentItem, exchangeRate])

  return (
    <div className={s.wrapper}>
      <Icon name="PaymentProcessing" color={'var(--accent-color-light)'} />
      <p className={s.message}>{t('payment_processed')}</p>
      <Link className={s.link} to={route.BILLING}>
        {t('Finance/Accounts')}
      </Link>
    </div>
  )
}
