import PropTypes from 'prop-types'
import DomainsTableItem from './DomainsTableItem'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { CheckBox } from '@components'
import s from './DomainsTable.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['domains', 'other'])
  const {
    list,
    selctedItem,
    setSelctedItem,
    editDomainHandler,
    deleteDomainHandler,
    renewDomainHandler,
    historyDomainHandler,
    whoisDomainHandler,
    NSDomainHandler,
    rights,
    unpaidItems
  } = props

  const setSelectedAll = val => {
    if (val) {
      setSelctedItem(list)
      return
    }
    setSelctedItem([])
  }

  const isAllActive = list?.length === selctedItem?.length

  return (
    <div className={s.table}>
      <div className={s.tableHeader}>
        <div className={s.checkBoxColumn}>
          <CheckBox
            className={s.check_box}
            value={isAllActive}
            onClick={() => setSelectedAll(!isAllActive)}
          />
        </div>
        <div className={s.headerColumnsWithoutCheckBox}>
          <span className={cn(s.title_text, s.first_item)}>{t('Id')}:</span>
          <span className={cn(s.title_text, s.second_item)}>{t('Domain name')}:</span>
          <span className={cn(s.title_text, s.third_item)}>{t('Tariff')}:</span>
          <span className={cn(s.title_text, s.fourth_item)}>{t('Valid until')}:</span>
          <span className={cn(s.title_text, s.fifth_item)}>{t('State')}:</span>
          <span className={cn(s.title_text, s.sixth_item)}>{t('Price')}:</span>
          <span className={cn(s.title_text, s.seventh_item)} />
        </div>
      </div>
      {list?.map(el => {
        const { id, domain, pricelist, real_expiredate, item_status, cost } = el

        const addSelectedItem = (val, ids) => {
          if (val) {
            setSelctedItem(s => [...s, ids])
            return
          }
          setSelctedItem(s => s.filter(el => el !== ids))
        }

        return (
          <DomainsTableItem
            key={id?.$}
            id={id?.$}
            domain={domain?.$}
            tariff={pricelist?.$}
            expiredate={real_expiredate?.$}
            status={item_status?.$}
            cost={cost?.$}
            setSelctedItem={addSelectedItem}
            selected={selctedItem}
            el={el}
            historyDomainHandler={historyDomainHandler}
            deleteDomainHandler={deleteDomainHandler}
            editDomainHandler={editDomainHandler}
            renewDomainHandler={renewDomainHandler}
            NSDomainHandler={NSDomainHandler}
            whoisDomainHandler={whoisDomainHandler}
            rights={rights}
            unpaidItems={unpaidItems}
          />
        )
      })}
    </div>
  )
}

Component.propTypes = {
  list: PropTypes.array,
  setSelctedPayment: PropTypes.func,
  selctedPayment: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.object]),
  rights: PropTypes.object,
}

Component.defaultProps = {
  list: [],
}
