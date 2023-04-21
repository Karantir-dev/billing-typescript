import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { SuccessPay } from '../../../images'
import { SITE_URL } from '../../../config/config'
import { coockies, parseLang } from '../../../utils'
import { useDispatch, useSelector } from 'react-redux'
import { billingOperations, billingSelectors } from '../../../Redux'
import { AuthPageHeader } from '../../../Pages'
import * as routes from '../../../routes'
import s from './SuccessPayment.module.scss'

export default function Component() {
  const { t, i18n } = useTranslation(['billing', 'other'])
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const data = coockies.getCookie('cartData')
  const cartData = JSON.parse(data)

  const reffilId = coockies.getCookie('reffil_id')

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
        e => e?.billorder?.$ === cartData?.billorder || e?.id?.$ === reffilId,
      )

      if (item) {
        setPaymentId(item)
      }
    }
  }, [paymentsList])

  useEffect(() => {
    if (paymentId) {
      if (cartData) {
        window.dataLayer.push({ ecommerce: null })
        window.dataLayer.push({
          event: 'purchase',
          ecommerce: {
            transaction_id: paymentId?.id?.$ || cartData?.billorder,
            affiliation: 'cp.zomro.com',
            value: Number(cartData?.total_sum) || 0,
            tax: Number(cartData?.tax) || 0,
            shipping: '0',
            currency: 'EUR',
            coupon: cartData?.promocode,
            items: cartData?.items,
          },
        })

        coockies.eraseCookie('cartData')
      }
      if (reffilId) {
        window.dataLayer.push({ ecommerce: null })
        window.dataLayer.push({
          event: 'purchase',
          ecommerce: {
            transaction_id: paymentId?.id?.$ || reffilId,
            affiliation: 'cp.zomro.com',
            value: Number(paymentId?.paymethodamount_iso?.$?.replace('EUR', '')) || 0,
            tax: Number(cartData?.tax) || 0,
            shipping: '0',
            currency: 'EUR',
            coupon: cartData?.promocode,
            items: [
              {
                item_name: 'Reffil',
                item_id: paymentId?.id?.$ || '',
                price: Number(paymentId?.paymethodamount_iso?.$?.replace('EUR', '')) || 0,
                item_category: 'Reffil account',
                quantity: 1,
              },
            ],
          },
        })

        coockies.eraseCookie('reffil_id')
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
