import React from 'react'
import { Gift, GiftDt } from '../../../images'
import { useSelector } from 'react-redux'
import { selectors } from '../../../Redux'
import { useTranslation } from 'react-i18next'
import s from './BlackFridayGift.module.scss'

export default function Component(props) {
  const { code } = props

  const { t } = useTranslation(['cart', 'other'])
  const darkTheme = useSelector(selectors.getTheme) === 'dark'

  return (
    <div className={s.giftBlock}>
      <div className={s.titleBlock}>
        {darkTheme ? <GiftDt /> : <Gift />}
        {t('Gift')}:
      </div>

      <div className={s.descr}>
        {t(
          'To receive a free service, complete the following order (with a separate check after purchase) and enter the promotional code',
        )}{' '}
        {<b>{code}</b>} {`(${t('can be used only once')})`}
      </div>

      <div className={s.cardBlock}>
        <div className={s.card}>
          <span className={s.cardTitle}>VPN</span>
          <img
            className={s.img}
            src={require('./../../../images/cart/vpn.png')}
            alt="vpn"
          />
          <div className={s.priceBlock}>
            <span>1.00 EUR/{t('per month', { ns: 'other' })}</span>
            <span>{t('Is free')}</span>
          </div>
        </div>
        <div className={s.card}>
          <span className={s.cardTitle}>FTP</span>
          <div className={s.img}>100GB</div>
          <div className={s.priceBlock}>
            <span>3.00 EUR/{t('per month', { ns: 'other' })}</span>
            <span>{t('Is free')}</span>
          </div>
        </div>
        <div className={s.card}>
          <span className={s.cardTitle}>{t('Site care')}</span>
          <img
            className={s.img}
            src={require('./../../../images/cart/sitecare.png')}
            alt="vhost"
          />
          <div className={s.priceBlock}>
            <span>20.97€/{t('for three months', { ns: 'other' })}</span>
            <span>{t('Is free')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
