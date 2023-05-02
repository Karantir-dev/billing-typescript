import React from 'react'
import { useTranslation } from 'react-i18next'
import s from '../../AuthPage.module.scss'

export default function Component() {
  const { t } = useTranslation('other')

  return (
    <>
      <img
        id="banner-img"
        className={s.bannerImg}
        src={require('../../../../images/banners/HalloweenBig.png')}
        alt="banner"
      />
      <div className={s.saleHalloween}>
        <div>
          <div className={s.saleText}>{t('discounts')}</div>
          <div className={s.halloweenText}>{t('on_halloween')}</div>
          <div className={s.halloweenPeriod}>{t('promotion_period')}</div>
          <ul className={s.listOfSale}>
            <li>
              <b>– 70%</b> {t('for virtual hosting')}
            </li>
            <li>
              <b>– 40%</b> {'for VPS'}
            </li>
            <li>
              <b>– 15%</b> {t('for dedicated servers')}
            </li>
            <li>
              <b>– 20%</b> {t('for VPN')}
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
