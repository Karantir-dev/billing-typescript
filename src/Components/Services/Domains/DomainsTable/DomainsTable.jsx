import React from 'react'
import PropTypes from 'prop-types'
import PaymentsTableItem from './DomainsTableItem'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
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
  } = props
  return (
    <div className={s.table}>
      <div className={s.tableHeader}>
        <span className={cn(s.title_text, s.first_item)}>{t('Id')}:</span>
        <span className={cn(s.title_text, s.second_item)}>{t('Domain name')}:</span>
        <span className={cn(s.title_text, s.third_item)}>{t('Tariff')}:</span>
        <span className={cn(s.title_text, s.fourth_item)}>{t('Valid until')}:</span>
        <span className={cn(s.title_text, s.fifth_item)}>{t('State')}:</span>
        <span className={cn(s.title_text, s.sixth_item)}>{t('Price')}:</span>
      </div>
      {list?.map(el => {
        const { id, domain, pricelist, real_expiredate, item_status, cost } = el

        let onItemClick = () => setSelctedItem(el)

        return (
          <PaymentsTableItem
            key={id?.$}
            id={id?.$}
            domain={domain?.$}
            tariff={pricelist?.$}
            expiredate={real_expiredate?.$}
            status={item_status?.$}
            cost={cost?.$}
            setSelctedItem={onItemClick}
            selected={selctedItem?.id?.$ === id?.$}
            el={el}
            historyDomainHandler={historyDomainHandler}
            deleteDomainHandler={deleteDomainHandler}
            editDomainHandler={editDomainHandler}
            renewDomainHandler={renewDomainHandler}
            NSDomainHandler={NSDomainHandler}
            whoisDomainHandler={whoisDomainHandler}
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
}

Component.defaultProps = {
  list: [],
}
