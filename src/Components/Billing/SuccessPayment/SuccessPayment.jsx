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

  const refillId = cookies.getCookie('refill_id')

  const paymentsList = useSelector(billingSelectors.getPaymentsList)

  const [paymentId, setPaymentId] = useState(null)

  const backHandler = () => {
    navigate(routes.BILLING)
  }

  useEffect(() => {
    const data = { p_num: 1, p_cnt: 1 }
    dispatch(billingOperations.getPayments(data))
  }, [])

  useEffect(() => {
    if (paymentsList && paymentsList?.length > 0) {
      const item = paymentsList?.find(
        e => e?.billorder?.$ === cartData?.billorder || e?.id?.$ === refillId,
      )

      if (item) {
        setPaymentId(item)
      }
    }
  }, [paymentsList])

  useEffect(() => {
    if (paymentId) {
      window.dataLayer.push({ ecommerce: null })
      if (cartData) {
        window.dataLayer.push({
          event: 'purchase',
          ecommerce: {
            transaction_id: paymentId?.id?.$ || `No payment id (billorder: ${cartData?.billorder})` ,
            affiliation: 'cp.zomro.com',
            value: Number(cartData?.total_sum) || 0,
            tax: Number(cartData?.tax) || 0,
            shipping: '0',
            currency: 'EUR',
            coupon: cartData?.promocode,
            items: cartData?.items,
          },
        })

        cookies.eraseCookie('cartData')
      }
      if (refillId) {
        window.dataLayer.push({
          event: 'purchase',
          ecommerce: {
            transaction_id: paymentId?.id?.$ || refillId,
            affiliation: 'cp.zomro.com',
            value: Number(paymentId?.paymethodamount_iso?.$?.replace('EUR', '')) || 0,
            tax: Number(paymentId?.tax?.$?.replace('EUR', '')) || 0,
            currency: 'EUR',
            items: [
              {
                item_name: 'Refill',
                item_id: paymentId?.id?.$ || '',
                price: Number(paymentId?.paymethodamount_iso?.$?.replace('EUR', '')) || 0,
                item_category: 'Refill account',
                quantity: 1,
              },
            ],
          },
        })

        cookies.eraseCookie('refill_id')
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
