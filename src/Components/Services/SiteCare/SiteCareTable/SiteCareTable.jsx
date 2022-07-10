import React from 'react'
import PropTypes from 'prop-types'
import SiteCareTableItem from './SiteCareTableItem'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import s from './SiteCareTable.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['domains', 'other'])
  const {
    list,
    selctedItem,
    setSelctedItem,
    historySiteCareHandler,
    prolongSiteCareHandler,
    editSiteCareHandler,
    deleteSiteCareHandler,
    rights,
  } = props
  return (
    <div className={s.table}>
      <div className={s.tableHeader}>
        <span className={cn(s.title_text, s.first_item)}>{t('Id')}:</span>
        <span className={cn(s.title_text, s.second_item)}>{t('Tariff')}:</span>
        <span className={cn(s.title_text, s.third_item)}>{t('Data center')}:</span>
        <span className={cn(s.title_text, s.fourth_item)}>{t('Valid until')}:</span>
        <span className={cn(s.title_text, s.fifth_item)}>{t('State')}:</span>
        <span className={cn(s.title_text, s.sixth_item)}>{t('Price')}:</span>
      </div>
      {list?.map(el => {
        const { id, pricelist, real_expiredate, item_status, cost, datacentername } = el

        let onItemClick = () => setSelctedItem(el)

        return (
          <SiteCareTableItem
            key={id?.$}
            id={id?.$}
            tariff={pricelist?.$}
            expiredate={real_expiredate?.$}
            status={item_status?.$}
            item_status={item_status}
            cost={cost?.$}
            setSelctedItem={onItemClick}
            selected={selctedItem?.id?.$ === id?.$}
            datacentername={datacentername?.$}
            el={el}
            historySiteCareHandler={historySiteCareHandler}
            prolongSiteCareHandler={prolongSiteCareHandler}
            editSiteCareHandler={editSiteCareHandler}
            deleteSiteCareHandler={deleteSiteCareHandler}
            rights={rights}
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
