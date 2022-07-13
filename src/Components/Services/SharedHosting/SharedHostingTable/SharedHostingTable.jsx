import React from 'react'
import PropTypes from 'prop-types'
import SharedHostingTableItem from './SharedHostingTableItem'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import s from './SharedHostingTable.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['domains', 'other'])
  const {
    list,
    selctedItem,
    setSelctedItem,
    historyVhostHandler,
    instructionVhostHandler,
    platformVhostHandler,
    prolongVhostHandler,
    editVhostHandler,
    changeTariffVhostHandler,
    rights,
  } = props
  return (
    <div className={s.table}>
      <div className={s.tableHeader}>
        <span className={cn(s.title_text, s.first_item)}>{t('Id')}:</span>
        <span className={cn(s.title_text, s.second_item)}>{t('Domain name')}:</span>
        <span className={cn(s.title_text, s.third_item)}>{t('IP address')}:</span>
        <span className={cn(s.title_text, s.fourth_item)}>{t('Tariff')}:</span>
        <span className={cn(s.title_text, s.fifth_item)}>{t('Data center')}:</span>
        <span className={cn(s.title_text, s.sixth_item)}>{t('Valid until')}:</span>
        <span className={cn(s.title_text, s.seventh_item)}>
          {t('status', { ns: 'other' })}:
        </span>
        <span className={cn(s.title_text, s.eighth_item)}>{t('Price')}:</span>
      </div>
      {list?.map(el => {
        const {
          id,
          domain,
          pricelist,
          real_expiredate,
          item_status,
          cost,
          datacentername,
          ip,
        } = el

        let onItemClick = () => setSelctedItem(el)

        return (
          <SharedHostingTableItem
            key={id?.$}
            id={id?.$}
            domain={domain?.$}
            tariff={pricelist?.$}
            expiredate={real_expiredate?.$}
            status={item_status?.$}
            cost={cost?.$}
            setSelctedItem={onItemClick}
            selected={selctedItem?.id?.$ === id?.$}
            datacentername={datacentername?.$}
            ip={ip?.$}
            el={el}
            historyVhostHandler={historyVhostHandler}
            instructionVhostHandler={instructionVhostHandler}
            platformVhostHandler={platformVhostHandler}
            prolongVhostHandler={prolongVhostHandler}
            editVhostHandler={editVhostHandler}
            changeTariffVhostHandler={changeTariffVhostHandler}
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
