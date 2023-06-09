import { useTranslation } from 'react-i18next'
import Percent14 from './Percent14'
import s from '../../AuthPage.module.scss'

export default function Component() {
  const { t } = useTranslation('other')

  return (
    <>
      <img
        id="banner-img"
        className={s.bannerImg}
        src={require('@images/banners/ValentinesDay.png')}
        alt="banner"
      />
      <div className={s.saleHalloween}>
        <div>
          <div className={s.saleText}>{t('On Valentines Day')}</div>
          <div className={s.halloweenText}>
            {t('CASHBACK')}{' '}
            <div className={s.percent}>
              <Percent14 />
            </div>
          </div>

          <div className={s.saleDescr}>
            <p>{t('The promotion is valid from 14.02 to 16.02')}</p>
            <p>
              {t(
                'Order any of our services or top up your balance for any amount and get a 14% cashback to your account in your personal account.',
              )}
            </p>
            <p>{t('Cashback you can spend on our services in the future')}</p>
          </div>
        </div>
      </div>
    </>
  )
}
