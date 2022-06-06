import React from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import PropTypes from 'prop-types'

import s from './DedicIPList.module.scss'

import DedicIPItem from '../DedicIPItem/DedicIPItem'
import DedicIPMobileItem from '../DedicIPMobileItem/DedicIPMobileItem'

export default function DedicIPList({
  IPList,
  setElidForEditModal,
  setActiveIP,
  activeIP,
}) {
  const { t } = useTranslation(['vds', 'dedicated_servers', 'other'])
  const widerThan1550 = useMediaQuery({ query: '(min-width: 1550px)' })

  console.log(IPList)

  return (
    <>
      {widerThan1550 && (
        <ul className={s.head_row}>
          <li className={s.label}>{t('ip_address')}:</li>
          <li className={s.label}>{t('mask', { ns: 'dedicated_servers' })}:</li>
          <li className={s.label}>{t('gateway', { ns: 'dedicated_servers' })}:</li>
          <li className={s.label}>{t('domain', { ns: 'dedicated_servers' })}:</li>
          <li className={s.label}>{t('type', { ns: 'dedicated_servers' })}:</li>
          <li className={s.label}>{t('status', { ns: 'other' })}:</li>
        </ul>
      )}

      <ul className={s.list}>
        {IPList?.map(el => {
          return widerThan1550 ? (
            <DedicIPItem
              key={el.id.$}
              ip={el}
              activeIP={activeIP}
              setActiveIP={setActiveIP}
            />
          ) : (
            <DedicIPMobileItem
              key={el.id.$}
              ip={el}
              setElidForEditModal={setElidForEditModal}
            />
          )
        })}
      </ul>
    </>
  )
}

DedicIPList.propTypes = {
  servers: PropTypes.arrayOf(PropTypes.object),
  setElidForEditModal: PropTypes.func,
  setActiveServer: PropTypes.func,
  activeServerID: PropTypes.string,
}
