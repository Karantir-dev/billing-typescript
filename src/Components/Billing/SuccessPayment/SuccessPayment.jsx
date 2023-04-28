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

  const data = cookies.getCookie('cartData')
  const cartData = JSON.parse(data)

  const refillId = cookies.getCookie('payment_id')

  const paymentsList = useSelector(billingSelectors.getPaymentsList)

  const [paymentId, setPaymentId] = useState(null)

  const backHandler = () => {
    navigate(routes.BILLING)
  }

  useEffect(() => {
    const data = { p_num: 1, p_cnt: 15 }
    dispatch(billingOperations.getPayments(data))
  }, [])

  useEffect(() => {
    if (paymentsList && paymentsList?.length > 0) {
      const item = paymentsList?.find(e => e?.id?.$ === refillId)

      if (item) {
        setPaymentId(item)
      }
    }
  }, [paymentsList])

  useEffect(() => {
    if (paymentId) {
      const currency = paymentId?.paymethodamount_iso?.$?.includes('RUB') ? 'RUB' : 'EUR'
      const value = paymentId?.paymethodamount_iso?.$?.replace(currency, '')
      const tax = paymentId?.tax?.$?.replace(currency, '')
      window.dataLayer.push({ ecommerce: null })

      if (paymentId?.billorder) {
        if (cartData?.billorder === paymentId?.billorder?.$) {
          window.dataLayer.push({
            event: 'purchase',
            ecommerce: {
              transaction_id:
                refillId || `No payment id (billorder: ${cartData?.billorder})`,
              affiliation: 'cp.zomro.com',
              value: Number(value) || 0,
              tax: Number(tax) || 0,
              currency: currency,
              shipping: '0',
              coupon: cartData?.promocode,
              items: cartData?.items,
            },
          })

          cookies.eraseCookie('cartData')
        } else {
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
              ],
            },
          })

          cookies.eraseCookie('cartData')
        }
      } else {
        if (refillId && !cartData) {
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

        cookies.eraseCookie('payment_id')
      }
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
