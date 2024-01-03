import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import PropTypes from 'prop-types'

import DNSItem from '../DNSItem/DNSItem'
import DNSMobileItem from '../DNSMobileItem/DNSMobileItem'
import { CheckBox } from '@components'

import s from './DNSList.module.scss'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { billingOperations } from '@src/Redux'

export default function DNSList({
  emptyFilter,
  dnsList,
  setElidForEditModal,
  setElidForProlongModal,
  setElidForHistoryModal,
  setElidForInstructionModal,
  pageRights,
  setActiveServices,
  activeServices,
  signal
}) {
  const dispatch = useDispatch()

  const { t } = useTranslation([
    'vds',
    'other',
    'dedicated_servers',
    'domains',
    'access_log',
    'dns',
  ])
  const widerThan1600 = useMediaQuery({ query: '(min-width: 1600px)' })

  const [unpaidItems, setUnpaidItems] = useState([])

  useEffect(() => {
    dispatch(billingOperations.getUnpaidOrders(setUnpaidItems, signal))
  }, [])

  if (dnsList) {
    if (dnsList.length === 0 && emptyFilter) {
      return (
        <div className={s.no_results_wrapper}>
          <p className={s.no_results_text}>{t('nothing_found', { ns: 'access_log' })}</p>
        </div>
      )
    }

    if (dnsList.length === 0 && dnsList) {
      return (
        <div className={s.no_service_wrapper}>
          <img
            src={require('@images/services/no_dns.png')}
            alt="dns"
            className={s.dns_img}
          />
          <p className={s.no_service_title}>
            {t('YOU DO NOT HAVE DNS HOSTING YET', { ns: 'dns' })}
          </p>
          <p className={s.no_service_description}>
            {t('no services description', { ns: 'dns' })}
          </p>
        </div>
      )
    }
  }

  const isAllActive = activeServices?.length === dnsList?.length
  const toggleIsActiveHandler = () => {
    isAllActive ? setActiveServices([]) : setActiveServices(dnsList)
  }

  return (
    <>
      {widerThan1600 && dnsList?.length > 0 && (
        <div className={s.head_row_wrapper}>
          <CheckBox
            className={s.check_box}
            value={isAllActive}
            onClick={toggleIsActiveHandler}
          />

          <ul className={s.head_row}>
            <li className={s.table_head}>Id:</li>
            <li className={s.table_head}>{t('tariff')}:</li>
            <li className={s.table_head}>
              {t('datacenter', { ns: 'dedicated_servers' })}:
            </li>
            <li className={s.table_head}>{t('created')}:</li>
            <li className={s.table_head}>{t('valid_until')}:</li>
            <li className={s.table_head}>{t('status', { ns: 'other' })}:</li>
            <li className={s.table_head}>{t('Price', { ns: 'domains' })}:</li>
            <li className={s.table_head}></li>
          </ul>
        </div>
      )}

      <ul className={s.list}>
        {dnsList?.map(el => {
          return widerThan1600 ? (
            <DNSItem
              key={el.id.$}
              storage={el}
              activeServices={activeServices}
              setActiveServices={setActiveServices}
              setElidForEditModal={() => setElidForEditModal(el.id.$)}
              setElidForProlongModal={() => setElidForProlongModal([el.id.$])}
              setElidForHistoryModal={() => setElidForHistoryModal(el.id.$)}
              setElidForInstructionModal={() => setElidForInstructionModal(el.id.$)}
              pageRights={pageRights}
              unpaidItems={unpaidItems}
            />
          ) : (
            <DNSMobileItem
              key={el.id.$}
              storage={el}
              setElidForEditModal={() => setElidForEditModal(el.id.$)}
              setElidForProlongModal={() => setElidForProlongModal([el.id.$])}
              setElidForHistoryModal={() => setElidForHistoryModal(el.id.$)}
              setElidForInstructionModal={() => setElidForInstructionModal(el.id.$)}
              activeServices={activeServices}
              setActiveServices={setActiveServices}
              pageRights={pageRights}
              unpaidItems={unpaidItems}
            />
          )
        })}
      </ul>
    </>
  )
}

DNSList.propTypes = {
  dnsList: PropTypes.arrayOf(PropTypes.object),
  emptyFilter: PropTypes.bool,
  setElidForEditModal: PropTypes.func,
  setElidForProlongModal: PropTypes.func,
  setElidForHistoryModal: PropTypes.func,
  setElidForInstructionModal: PropTypes.func,
  setActiveServices: PropTypes.func,
  activeServices: PropTypes.arrayOf(PropTypes.object),
  pageRights: PropTypes.object,
}
