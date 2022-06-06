import React from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import PropTypes from 'prop-types'

import s from './DedicList.module.scss'
import DedicItem from '../DedicItem/DedicItem'
import DedicMobileItem from '../DedicMobileItem/DedicMobileItem'

export default function DedicList({
  servers,
  setElidForEditModal,
  setActiveServer,
  activeServerID,
}) {
  const { t } = useTranslation(['vds', 'other'])
  const widerThan1550 = useMediaQuery({ query: '(min-width: 1550px)' })

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
        {servers?.map(el => {
          return widerThan1550 ? (
            <DedicItem
              key={el.id.$}
              server={el}
              activeServerID={activeServerID}
              setActiveServer={setActiveServer}
            />
          ) : (
            <DedicMobileItem
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

DedicList.propTypes = {
  servers: PropTypes.arrayOf(PropTypes.object),
  setElidForEditModal: PropTypes.func,
  setActiveServer: PropTypes.func,
  activeServerID: PropTypes.string,
}
