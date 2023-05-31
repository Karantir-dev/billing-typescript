import s from './SiteCareItem.module.scss'
import { translatePeriodToMonths } from '../../../utils'
import { useTranslation } from 'react-i18next'

export default function Component(props) {
  const { pricelist_name, itemId, count, period } = props
  const { t } = useTranslation(['other', 'vds'])

  return (
    <div className={s.domainItem}>
      <div className={s.priceList}>
        <span className={s.domainName}>
          {pricelist_name} #{itemId}
        </span>
        <div className={s.periodInfo}>
          <span>
            {t('Period', { ns: 'other' })}: {period} {translatePeriodToMonths(period)}
          </span>
          <span>
            {t('amount', { ns: 'vds' })}: {count} {t('pcs.', { ns: 'vds' })}
          </span>
        </div>
      </div>
    </div>
  )
}
