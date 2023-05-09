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

  const refillId = cookies.getCookie('payment_id') // payment ID, obtained during the transition to the payment system

  const paymentsList = useSelector(billingSelectors.getPaymentsList) // list of all user payments

  const [paymentId, setPaymentId] = useState(null)
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
      const item = paymentsList?.find(e => e?.id?.$ === refillId)

      if (item) {
        if (item?.billorder) {
          //if the billorder field is present in the payment, then this is a purchase through the basket
          const data = cookies.getCookie(`cartData_${refillId}`)
          // check whether we have such a basket saved (baskets are stored for 5 days from the moment of its creation)
          if (data) {
            //if we find such a basket, then we save
            const dataJson = JSON.parse(data)
            setCartData(dataJson)
          }
        }
        setPaymentId(item) // write down the rest of the payment data
      }
    }
  }, [paymentsList])

  useEffect(() => {
    if (paymentId) {
      //if we have payment
      const currency = paymentId?.paymethodamount_iso?.$?.includes('RUB') ? 'RUB' : 'EUR' //check what currency used
      const value = paymentId?.paymethodamount_iso?.$?.replace(currency, '') //get the payment amount
      const tax = paymentId?.tax?.$?.replace(currency, '') //get the payment tax
      window.dataLayer.push({ ecommerce: null }) //clean data layer ecommerce

      if (paymentId?.billorder) {
        // we check that the payment comes from the cart
        if (cartData?.billorder === paymentId?.billorder?.$) {
          // we check if we have such a basket and send it to analytics along with the items
          window.dataLayer.push({
            event: 'purchase',
            ecommerce: {
              transaction_id:
                refillId || `No payment id (billorder: ${cartData?.billorder})`,
              //if suddenly there is no payment ID, we will send the basket ID (probability is very small)
              affiliation: 'cp.zomro.com',
              value: Number(value) || 0,
              tax: Number(tax) || 0,
              currency: currency,
              shipping: '0',
              coupon: cartData?.promocode,
              items: cartData?.items,
            },
          })

          cookies.eraseCookie(`cartData_${refillId}`) // if the cart was used, then clear it
        } else {
          // if there is no such basket, we record the payment data but without the items that were in the basket, and without promocode
          window.dataLayer.push({
            event: 'purchase',
            ecommerce: {
              transaction_id: refillId,
              affiliation: 'cp.zomro.com',
              value: Number(value) || 0,
              tax: Number(tax) || 0,
              currency: currency,
              shipping: '0',
              coupon: '',
              items: [
                {
                  item_name: 'Cart buy',
                  item_id: paymentId?.billorder?.$ || '',
                  price: Number(value) || 0,
                  item_category: 'Lost data' || '',
                  quantity: 1,
                },
              ], // items if we did not find the basket
            },
          })
        }
      } else {
        if (refillId && !cartData) {
          // if this payment is not from the cart we send the payment ID and record the refill of the account in the items
          window.dataLayer.push({
            event: 'purchase',
            ecommerce: {
              transaction_id: paymentId?.id?.$ || refillId,
              affiliation: 'cp.zomro.com',
              value: Number(value) || 0,
              tax: Number(tax) || 0,
              currency: currency,
              items: [
                {
                  item_name: 'Refill',
                  item_id: paymentId?.id?.$ || '',
                  price: Number(value) || 0,
                  item_category: 'Refill account',
                  quantity: 1,
                },
              ],
            },
          })
        }
      }
      cookies.eraseCookie('payment_id') // if the payment id was used, then clear it
    }
  }, [paymentId])

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
