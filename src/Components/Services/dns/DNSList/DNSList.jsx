import React from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import PropTypes from 'prop-types'

import DNSItem from '../DNSItem/DNSItem'
import DNSMobileItem from '../DNSMobileItem/DNSMobileItem'
import { CheckBox } from '../../..'

import s from './DNSList.module.scss'

export default function DNSList({
  emptyFilter,
  dnsList,
  setElidForEditModal,
  setElidForProlongModal,
  setElidForHistoryModal,
  setElidForInstructionModal,
  setActiveServer,
  activeServerID,
  pageRights,
  setActiveServices,
  activeServices,
}) {
  const { t } = useTranslation([
    'vds',
    'other',
    'dedicated_servers',
    'domains',
    'access_log',
    'dns',
  ])
  const widerThan1550 = useMediaQuery({ query: '(min-width: 1600px)' })

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
            src={require('../../../../images/services/no_dns.png')}
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

  return (
    <>
      {widerThan1550 && dnsList?.length > 0 && (
        <div className={s.head_row_wrapper}>
          <CheckBox
            className={s.check_box}
            initialState={activeServices?.length === dnsList?.length}
            func={isChecked => {
              isChecked ? setActiveServices([]) : setActiveServices(dnsList)
            }}
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
          return widerThan1550 ? (
            <DNSItem
              key={el.id.$}
              storage={el}
              activeServerID={activeServerID}
              setActiveServer={setActiveServer}
              activeServices={activeServices}
              setActiveServices={setActiveServices}
              setElidForProlongModal={() => setElidForProlongModal([el.id.$])}
              pageRights={pageRights}
            />
          ) : (
            <DNSMobileItem
              key={el.id.$}
              storage={el}
              setElidForEditModal={setElidForEditModal}
              setElidForProlongModal={() => setElidForProlongModal([el.id.$])}
              setElidForHistoryModal={setElidForHistoryModal}
              setElidForInstructionModal={setElidForInstructionModal}
              setActiveServer={setActiveServer}
              activeServices={activeServices}
              pageRights={pageRights}
            />
          )
        })}
      </ul>
    </>
  )
}

DNSList.propTypes = {
  storageList: PropTypes.arrayOf(PropTypes.object),
  setElidForEditModal: PropTypes.func,
  setActiveServer: PropTypes.func,
  activeServerID: PropTypes.string,
  pageRights: PropTypes.object,
}
