import { useTranslation } from 'react-i18next'
import { Icon } from '@components'
import s from './DomainItem.module.scss'
import { translatePeriodToMonths } from '@utils'

export default function Component(props) {
  const { t } = useTranslation(['cart', 'other'])

  const { desc, cost, discount_percent, fullcost, deleteItemHandler, period } = props

  const renderDesc = () => {
    const beforeWord = 'Domain registration'
    const afterWord = '</b>'

    const domainName = desc.slice(
      desc.indexOf(beforeWord) + beforeWord?.length,
      desc.indexOf(afterWord),
    )

    const beforeWordProtect = 'Data protection'

    const dataProtect = desc.slice(
      desc.indexOf(beforeWordProtect) + beforeWordProtect?.length,
    )

    return {
      domainName,
      dataProtect,
    }
  }

  return (
    <div className={s.domainItem}>
      <div className={s.priceList}>
        <div className={s.domainInfo}>
          <span className={s.domainName}>{renderDesc()?.domainName}</span>
          {desc?.includes('Data protection') && (
            <span className={s.domainProtect}>
              {t('Data protection')}: {t(renderDesc()?.dataProtect?.trim())}
            </span>
          )}
          <div className={s.periodInfo}>
            <span>
              {t('Period', { ns: 'other' })}: {period} {translatePeriodToMonths(period)}
            </span>
          </div>
        </div>
        <div className={s.costBlock}>
          <div className={s.cost}>
            {cost} EUR/{t('year', { ns: 'other' }).toLowerCase()}
          </div>
          {discount_percent && (
            <div className={s.discountBlock}>
              <span className={s.discountPerCent}>-{discount_percent}</span>
              <span className={s.fullcost}>{fullcost} EUR</span>
            </div>
          )}
        </div>
      </div>
      {deleteItemHandler && (
        <Icon name="Delete" onClick={deleteItemHandler} width={15} className={s.deleteIcon} />
      )}
    </div>
  )
}
