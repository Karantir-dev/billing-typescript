import { useTranslation } from 'react-i18next'
import StarSale from './StarSale'
import Line from './Line'

import s from '../../AuthPage.module.scss'
import { Icon } from '@components'

export default function Component() {
  const { t } = useTranslation('other')

  return (
    <>
      <img
        id="banner-img"
        className={s.bannerImg}
        src={require('@images/banners/BlackFridayBig.png')}
        alt="banner"
      />
      <div className={s.saleHalloween}>
        <div>
          <div className={s.saleText}>{t('BLACK FRIDAY')}</div>
          <div className={s.halloweenText}>{t('IN ZOMRO')}</div>

          <div className={s.saleDescrBlock}>
            <div className={s.saleDescrRow}>
              <div className={s.saleDescrItem}>
                <div className={s.starBlock}>
                  <StarSale />
                  <span>-90%</span>
                </div>
                <span className={s.saleDecrName}>{t('Shared hosting')}</span>
              </div>
              <div className={s.saleDescrItem}>
                <div className={s.starBlock}>
                  <StarSale />
                  <span>-60%</span>
                </div>
                <span className={s.saleDecrName}>VPS</span>
              </div>
            </div>
            <div className={s.saleDescrRow}>
              <div className={s.saleDescrItem}>
                <div className={s.starBlock}>
                  <StarSale />
                  <span>-20%</span>
                </div>
                <span className={s.saleDecrName}>{t('Dedicated server')}</span>
              </div>
              <div className={s.saleDescrItem}>
                <div className={s.starBlock}>
                  <StarSale />
                  <span>-10%</span>
                </div>
                <span className={s.saleDecrName}>{t('Server for Forex')}</span>
              </div>
            </div>
          </div>

          <div className={s.mainPromoBlock}>
            <span>
              {t('Discount promo code')}: <b>NOV22FR25</b>*
            </span>
            <span>*{t('promo code can be used multiple times')}</span>
          </div>

          <Line />

          <div className={s.addGiftBlock}>
            <div className={s.addGift}>+ {t('As a gift')}</div>

            <div className={s.giftList}>
              <span>
                <Icon name="GiftDt" /> {t('1 VPN - free for 1 month')}
              </span>
              <span>
                <Icon name="GiftDt" /> {t('1 FTP storage for 100 GB - free for 1 month')}
              </span>
              <span>
                <Icon name="GiftDt" /> {t('1 Site care - free for 3 months')}
              </span>
            </div>

            <div className={s.ruleGift}>
              <span className={s.ruleTitle}>
                {t('Subject to purchase (second order, separate check)')}:
              </span>

              <div className={s.ruleList}>
                <span>{t('Hosting (promo code VR87FR)')}</span>
                <span>{t('VPS (promo code OM34VS)')}</span>
                <span>{t('Dedicated server (promo code YT52BD)')}</span>
              </div>

              <div className={s.ruleDescr}>
                {t('The above promo codes can only be used once.')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
