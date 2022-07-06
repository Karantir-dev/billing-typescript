import React from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import PropTypes from 'prop-types'

import s from './DedicList.module.scss'
import DedicItem from '../DedicItem/DedicItem'
import DedicMobileItem from '../DedicMobileItem/DedicMobileItem'

export default function DedicList({
  emptyFilter,
  servers,
  setElidForEditModal,
  setElidForProlongModal,
  setElidForHistoryModal,
  setElidForInstructionModal,
  setElidForRebootModal,
  setActiveServer,
  activeServerID,
}) {
  const { t } = useTranslation(['vds', 'other', 'access_log', 'dedicated_servers'])
  const widerThan1550 = useMediaQuery({ query: '(min-width: 1600px)' })

  if (servers) {
    if (servers.length === 0 && emptyFilter) {
      return (
        <div className={s.no_results_wrapper}>
          <p className={s.no_results_text}>{t('nothing_found', { ns: 'access_log' })}</p>
        </div>
      )
    }

    if (servers.length === 0 && servers) {
      return (
        <div className={s.no_service_wrapper}>
          <img
            src={require('../../../../images/services/dedicated.webp')}
            alt="dedic"
            className={s.dedic_img}
          />
          <p className={s.no_service_title}>
            {t('YOU DO NOT HAVE A DEDICATED SERVER YET', { ns: 'dedicated_servers' })}
          </p>
          <p className={s.no_service_description}>
            {t('dedic no services description', { ns: 'dedicated_servers' })}
          </p>
        </div>
      )
    }
  }

  return (
    <>
      {widerThan1550 && servers?.length > 0 && (
        <ul className={s.head_row}>
          <li className={s.table_head}>Id:</li>
          <li className={s.table_head}>{t('domain_name')}:</li>
          <li className={s.table_head}>{t('ip_address')}:</li>
          <li className={s.table_head}>{t('ostempl')}:</li>
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
              setElidForProlongModal={setElidForProlongModal}
              setElidForHistoryModal={setElidForHistoryModal}
              setElidForInstructionModal={setElidForInstructionModal}
              setElidForRebootModal={setElidForRebootModal}
              setActiveServer={setActiveServer}
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
