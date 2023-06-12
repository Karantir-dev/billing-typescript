import s from './VpnItem.module.scss'
import { translatePeriodToMonths } from '@utils'
import { useTranslation } from 'react-i18next'

export default function Component(props) {
  const { pricelist_name, itemId, period } = props
  const { t } = useTranslation(['other', 'vds'])

  return (
    <div className={s.domainItem}>
      <div className={s.priceList}>
        <div className={s.domainInfo}>
          <span className={s.domainName}>
            {pricelist_name} #{itemId}
          </span>
          <div className={s.periodInfo}>
            <span>
              {t('Period', { ns: 'other' })}: {period} {translatePeriodToMonths(period)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
