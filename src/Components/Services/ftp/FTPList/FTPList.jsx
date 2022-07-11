import React from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import PropTypes from 'prop-types'

import s from './FTPList.module.scss'
import FTPItem from '../FTPItem/FTPItem'
import FTPMobileItem from '../FTPMobileItem/FTPMobileItem'

export default function FTPList({
  emptyFilter,
  storageList,
  setElidForEditModal,
  setElidForProlongModal,
  setElidForHistoryModal,
  setElidForInstructionModal,
  setActiveServer,
  activeServerID,
  rights,
}) {
  const { t } = useTranslation([
    'vds',
    'other',
    'dedicated_servers',
    'domains',
    'access_log',
    'ftp',
  ])
  const widerThan1550 = useMediaQuery({ query: '(min-width: 1600px)' })

  if (storageList) {
    if (storageList.length === 0 && emptyFilter) {
      return (
        <div className={s.no_results_wrapper}>
          <p className={s.no_results_text}>{t('nothing_found', { ns: 'access_log' })}</p>
        </div>
      )
    }

    if (storageList.length === 0) {
      return (
        <div className={s.no_service_wrapper}>
          <img
            src={require('../../../../images/services/ftp_storage.webp')}
            alt="ftp"
            className={s.ftp_img}
          />
          <p className={s.no_service_title}>
            {t('YOU DO NOT HAVE AN EXTERNAL FTP STORAGE YET', { ns: 'ftp' })}
          </p>
          <p className={s.no_service_description}>
            {t('no ftp services description', { ns: 'ftp' })}
          </p>
        </div>
      )
    }
  }

  return (
    <>
      {widerThan1550 && storageList?.length > 0 && (
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
            <FTPItem
              key={el.id.$}
              storage={el}
              activeServerID={activeServerID}
              setActiveServer={setActiveServer}
            />
          ) : (
            <FTPMobileItem
              key={el.id.$}
              storage={el}
              setElidForEditModal={setElidForEditModal}
              setElidForProlongModal={setElidForProlongModal}
              setElidForHistoryModal={setElidForHistoryModal}
              setElidForInstructionModal={setElidForInstructionModal}
              setActiveServer={setActiveServer}
              rights={rights}
            />
          )
        })}
      </ul>
    </>
  )
}

FTPList.propTypes = {
  servers: PropTypes.arrayOf(PropTypes.object),
  setElidForEditModal: PropTypes.func,
  setActiveServer: PropTypes.func,
  activeServerID: PropTypes.string,
  rights: PropTypes.object,
}