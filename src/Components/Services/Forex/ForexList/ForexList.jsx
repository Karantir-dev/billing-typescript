import React from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import PropTypes from 'prop-types'

import s from './ForexList.module.scss'
import ForexItem from '../ForexItem/ForexItem'
import ForexMobileItem from '../ForexMobileItem/ForexMobileItem'

export default function ForexList({
  emptyFilter,
  forexList,
  setElidForEditModal,
  setElidForProlongModal,
  setElidForHistoryModal,
  setElidForDeletionModal,
  setActiveServer,
  activeServerID,
  pageRights,
}) {
  const { t } = useTranslation([
    'vds',
    'other',
    'dedicated_servers',
    'domains',
    'access_log',
  ])
  const widerThan1550 = useMediaQuery({ query: '(min-width: 1600px)' })

  if (forexList) {
    if (forexList.length === 0 && emptyFilter) {
      return (
        <div className={s.no_results_wrapper}>
          <p className={s.no_results_text}>{t('nothing_found', { ns: 'access_log' })}</p>
        </div>
      )
    }

    if (forexList.length === 0 && forexList) {
      return (
        <div className={s.no_service_wrapper}>
          <img
            src={require('../../../../images/services/forexbox.webp')}
            alt="forex"
            className={s.forex_img}
          />
          <p className={s.no_service_title}>
            {t('YOU DO NOT HAVE A FOREX SERVER YET', { ns: 'other' })}
          </p>
          <p className={s.no_service_description}>
            {t('no services forex description', { ns: 'other' })}
          </p>
        </div>
      )
    }
  }

  return (
    <>
      {widerThan1550 && forexList?.length > 0 && (
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

      <div className={s.list}>
        {forexList?.map(el => {
          return widerThan1550 ? (
            <ForexItem
              key={el.id.$}
              server={el}
              activeServerID={activeServerID}
              setActiveServer={setActiveServer}
            />
          ) : (
            <ForexMobileItem
              key={el.id.$}
              server={el}
              setElidForEditModal={setElidForEditModal}
              setElidForProlongModal={setElidForProlongModal}
              setElidForHistoryModal={setElidForHistoryModal}
              setElidForDeletionModal={setElidForDeletionModal}
              setActiveServer={setActiveServer}
              pageRights={pageRights}
            />
          )
        })}
      </div>
    </>
  )
}

ForexList.propTypes = {
  servers: PropTypes.arrayOf(PropTypes.object),
  setElidForEditModal: PropTypes.func,
  setActiveServer: PropTypes.func,
  activeServerID: PropTypes.string,
  pageRights: PropTypes.object,
}
