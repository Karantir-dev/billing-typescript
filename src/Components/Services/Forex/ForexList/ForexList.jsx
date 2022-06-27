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
}) {
  const { t } = useTranslation(['vds', 'other', 'dedicated_servers', 'domains'])
  const widerThan1550 = useMediaQuery({ query: '(min-width: 1600px)' })

  if (forexList) {
    if (forexList.length === 0 && emptyFilter) {
      return <div>not matches </div>
    }

    if (forexList.length === 0 && forexList) {
      return (
        <div className={s.no_service_wrapper}>
          <img
            src={require('../../../../images/services/forexbox.webp')}
            alt="forexbox"
          />
          <p className={s.no_service_title}>You dont have a server yet</p>
          <p className={s.no_service_description}>Here must be service description</p>
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

      <ul className={s.list}>
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
            />
          )
        })}
      </ul>
    </>
  )
}

ForexList.propTypes = {
  servers: PropTypes.arrayOf(PropTypes.object),
  setElidForEditModal: PropTypes.func,
  setActiveServer: PropTypes.func,
  activeServerID: PropTypes.string,
}
