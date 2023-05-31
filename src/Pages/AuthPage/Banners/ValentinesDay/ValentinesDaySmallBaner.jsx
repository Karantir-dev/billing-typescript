import { SITE_URL } from '../../../../config/config'
import { useTranslation } from 'react-i18next'
import ValentinesDayText from './ValentinesDayText'
import s from '../../AuthPage.module.scss'

export default function Component() {
  const { t } = useTranslation('other')

  return (
    <>
      <img
        className={s.valentinesImg}
        src={require('../../../../images/banners/ValentainsMessage.png')}
        alt="gift"
      />
      <ValentinesDayText className={s.pumpkinsTextIcon} />
      <div className={s.valentinesText}>
        <div>{t('CASHBACK 14%')}</div>
        <div>{t('for all services from 14.02 to 16.02')}</div>
        <a target="_blank" href={`${SITE_URL}/stock`} rel="noreferrer">
          {t('more')}
        </a>
      </div>
    </>
  )
}
