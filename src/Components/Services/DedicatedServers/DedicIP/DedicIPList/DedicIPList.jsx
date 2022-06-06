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
  setActiveServer,
  activeServerID,
}) {
  const { t } = useTranslation(['vds', 'other'])
  const widerThan1550 = useMediaQuery({ query: '(min-width: 1550px)' })

  console.log(IPList)

  return (
    <>
      {widerThan1550 && (
        <ul className={s.head_row}>
          <li className={s.table_head}>Id:</li>
          <li className={s.table_head}>{t('domain_name')}:</li>
          <li className={s.table_head}>{t('ip_address')}:</li>
          <li className={s.table_head}>{t('OS_template')}:</li>
          <li className={s.table_head}>{t('tariff')}:</li>
          <li className={s.table_head}>{t('status')}:</li>
          <li className={s.table_head}>{t('created')}:</li>
          <li className={s.table_head}>{t('valid_until')}:</li>
        </ul>
      )}

      <ul className={s.list}>
        {IPList?.map(el => {
          return widerThan1550 ? (
            <DedicIPItem
              key={el.id.$}
              server={el}
              activeServerID={activeServerID}
              setActiveServer={setActiveServer}
            />
          ) : (
            <DedicIPMobileItem
              key={el.id.$}
              server={el}
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
