import { useMediaQuery } from 'react-responsive'
import { Delete } from '@images'
import s from './VhostItem.module.scss'
import { translatePeriodToMonths } from '@utils'
import { useTranslation } from 'react-i18next'

export default function Component(props) {
  const { pricelist_name, itemId, deleteItemHandler, count, period } = props
  const tabletOrHigher = useMediaQuery({ query: '(min-width: 768px)' })

  const { t } = useTranslation(['other', 'vds'])

  return (
    <div className={s.domainItem}>
      <div className={s.priceList}>
        {!tabletOrHigher && (
          <div className={s.control_bts_wrapper}>
            {typeof deleteItemHandler === 'function' && (
              <button className={s.btn_delete} type="button" onClick={deleteItemHandler}>
                <Delete />
              </button>
            )}
          </div>
        )}

        <div className={s.domainInfo}>
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

        {typeof deleteItemHandler === 'function' && tabletOrHigher && (
          <button className={s.btn_delete} type="button" onClick={deleteItemHandler}>
            <Delete />
          </button>
        )}
      </div>
    </div>
  )
}
