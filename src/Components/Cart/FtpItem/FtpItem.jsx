import { useMediaQuery } from 'react-responsive'
import { Delete } from '../../../images'
import s from './FtpItem.module.scss'
import { translatePeriodToMonths } from '../../../utils'
import { useTranslation } from 'react-i18next'

export default function FtpItem(props) {
  const { pricelist_name, deleteItemHandler, count, period } = props
  const { t } = useTranslation(['other', 'vds'])

  const tabletOrHigher = useMediaQuery({ query: '(min-width: 768px)' })

  return (
    <>
      <div className={s.server_item}>
        <div className={s.tarif_info}>
          <div className={s.priceList}>
            {!tabletOrHigher && (
              <div className={s.control_bts_wrapper}>
                {typeof deleteItemHandler === 'function' && (
                  <button
                    className={s.btn_delete}
                    type="button"
                    onClick={deleteItemHandler}
                  >
                    <Delete />
                  </button>
                )}
              </div>
            )}

            <div className={s.server_info}>
              <span className={s.domainName}>{pricelist_name}</span>
              <div className={s.periodInfo}>
                <span>
                  {t('Period', { ns: 'other' })}: {period}{' '}
                  {translatePeriodToMonths(period)}
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
      </div>
    </>
  )
}
