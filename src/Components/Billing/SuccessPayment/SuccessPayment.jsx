import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { SuccessPay } from '../../../images'
import { SITE_URL } from '../../../config/config'
import { cookies, parseLang } from '../../../utils'
import { useDispatch, useSelector } from 'react-redux'
import { billingOperations, billingSelectors } from '../../../Redux'
import { AuthPageHeader } from '../../../Pages'
import * as routes from '../../../routes'
import s from './SuccessPayment.module.scss'

export default function Component() {
  const { t, i18n } = useTranslation(['billing', 'other'])
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const paymentId = cookies.getCookie('payment_id') // payment ID, obtained during the transition to the payment system

  const paymentsList = useSelector(billingSelectors.getPaymentsList) // list of all user payments

  const [paymentItem, setPaymentItem] = useState(null)
  const [cartData, setCartData] = useState(null)

  const backHandler = () => {
    navigate(routes.BILLING)
  }

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
    if (paymentItem) {
      //if we have payment
      const currency = paymentItem?.paymethodamount_iso?.$?.includes('RUB')
        ? 'RUB'
        : 'EUR' //check what currency used
      const value = paymentItem?.paymethodamount_iso?.$?.replace(currency, '') //get the payment amount
      const tax = paymentItem?.tax?.$?.replace(currency, '') //get the payment tax
      window.dataLayer.push({ ecommerce: null }) //clean data layer ecommerce

      // If it is a purchase of services
      if (paymentItem?.billorder) {
        // If there is saved product data
        if (cartData?.billorder === paymentItem?.billorder?.$) {
          window.dataLayer.push({
            event: 'purchase',
            ecommerce: {
              transaction_id: paymentId,
              affiliation: 'cp.zomro.com',
              value: Number(value) || 0,
              tax: Number(tax) || 0,
              currency: currency,
              shipping: '0',
              coupon: cartData?.promocode,
              items: cartData?.items,
            },
          })

          cookies.eraseCookie(`cartData_${paymentId}`)

          // If there is NO saved product data
        } else {
          window.dataLayer.push({
            event: 'purchase',
            ecommerce: {
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
          })
        }

        // If it is a balance replenishment (we don`t have saved product data)
      } else {
        if (!cartData) {
          window.dataLayer.push({
            event: 'purchase',
            ecommerce: {
              transaction_id: paymentId,
              affiliation: 'cp.zomro.com',
              value: Number(value) || 0,
              tax: Number(tax) || 0,
              currency: currency,
              items: [
                {
                  item_name: 'Refill',
                  item_id: paymentId,
                  price: 0,
                  item_category: 'Refill',
                  quantity: 1,
                },
              ],
            },
          })
        }
      }
      cookies.eraseCookie('payment_id') // if the payment id was used, then clear it
    }
  }, [paymentItem])

  return (
    <div className={s.modalBg}>
      <AuthPageHeader onLogoClick={backHandler} />
      <div className={s.modalBlock}>
        <div className={s.modalTopBlock}>
          <SuccessPay />
          <div className={s.approved}>{t('Payment approved')}</div>
          <div className={s.completed}>{t('Payment was completed successfully')}</div>
        </div>

        <div className={s.linksBlock}>
          <a
            className={s.link}
            href={`${SITE_URL}/${parseLang(i18n?.language)}${
              i18n?.language !== 'en' ? '/' : ''
            }`}
          >
            {t('Back to site')}
          </a>
          <Link className={s.link} to={routes.BILLING}>
            {t('Back to billing')}
          </Link>
        </div>
      </div>
    </div>
  )
}
