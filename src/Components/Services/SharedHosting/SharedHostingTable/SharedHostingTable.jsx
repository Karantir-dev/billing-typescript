import React from 'react'
import PropTypes from 'prop-types'
import SharedHostingTableItem from './SharedHostingTableItem'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import s from './SharedHostingTable.module.scss'
import { CheckBox } from '../../..'
import { useMediaQuery } from 'react-responsive'

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
    activeServices,
    setActiveServices,
    setElidForProlongModal,
  } = props

  const widerThan1600 = useMediaQuery({ query: '(min-width: 1600px)' })

  const isAllActive = activeServices?.length === list?.length
  const toggleIsAllActiveHandler = () => {
    isAllActive ? setActiveServices([]) : setActiveServices(list)
  }

  return (
    <div className={s.table}>
      {widerThan1600 && (
        <div className={s.header_wrapper}>
          <CheckBox
            className={s.check_box}
            value={isAllActive}
            onClick={toggleIsAllActiveHandler}
          />
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
        </div>
      )}

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
            setElidForProlongModal={setElidForProlongModal}
            editVhostHandler={editVhostHandler}
            changeTariffVhostHandler={changeTariffVhostHandler}
            rights={rights}
            activeServices={activeServices}
            setActiveServices={setActiveServices}
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
  activeServices: PropTypes.array,
  setActiveServices: PropTypes.func,
  elidForProlongModal: PropTypes.array,
  setElidForProlongModal: PropTypes.func,
}

Component.defaultProps = {
  list: [],
}
