import React from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import PropTypes from 'prop-types'

import s from './DNSList.module.scss'
import DNSItem from '../DNSItem/DNSItem'
import DNSMobileItem from '../DNSMobileItem/DNSMobileItem'

export default function DNSList({
  storageList,
  setElidForEditModal,
  setElidForProlongModal,
  setElidForHistoryModal,
  setElidForInstructionModal,
  // setElidForChangeTarifModal,
  setActiveServer,
  activeServerID,
}) {
  const { t } = useTranslation(['vds', 'other', 'dedicated_servers', 'domains'])
  const widerThan1550 = useMediaQuery({ query: '(min-width: 1550px)' })

  return (
    <>
      {widerThan1550 && (
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
        </ul>
      )}

      <ul className={s.list}>
        {storageList?.map(el => {
          return widerThan1550 ? (
            <DNSItem
              key={el.id.$}
              storage={el}
              activeServerID={activeServerID}
              setActiveServer={setActiveServer}
            />
          ) : (
            <DNSMobileItem
              key={el.id.$}
              storage={el}
              setElidForEditModal={setElidForEditModal}
              setElidForProlongModal={setElidForProlongModal}
              setElidForHistoryModal={setElidForHistoryModal}
              setElidForInstructionModal={setElidForInstructionModal}
              // setElidForChangeTarifModal={setElidForChangeTarifModal}
              setActiveServer={setActiveServer}
            />
          )
        })}
      </ul>
    </>
  )
}

DNSList.propTypes = {
  servers: PropTypes.arrayOf(PropTypes.object),
  setElidForEditModal: PropTypes.func,
  setActiveServer: PropTypes.func,
  activeServerID: PropTypes.string,
}
