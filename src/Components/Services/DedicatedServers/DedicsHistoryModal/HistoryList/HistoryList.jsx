import React from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import PropTypes from 'prop-types'

import s from './HistoryList.module.scss'
import HistoryListItem from '../HistoryListItem/HistoryListItem'
import HistoryMobileListItem from '../HistoryMobileListItem/HistoryMobileListItem'

export default function HistoryList({ historyList }) {
  const { t } = useTranslation(['vds', 'other'])
  const widerThan1550 = useMediaQuery({ query: '(min-width: 1550px)' })

  return (
    <>
      {widerThan1550 && (
        <ul className={s.head_row}>
          <li className={s.table_head}>{t('date', { ns: 'other' })}:</li>
          <li className={s.table_head}>{t('Changing', { ns: 'other' })}:</li>
          <li className={s.table_head}>{t('user_name')}:</li>
          <li className={s.table_head}>{t('ip_address')}:</li>
        </ul>
      )}

      <ul className={s.list}>
        {historyList?.map((el, index) => {
          return widerThan1550 ? (
            <HistoryListItem key={index} history={el} />
          ) : (
            <HistoryMobileListItem key={index} history={el} />
          )
        })}
      </ul>
    </>
  )
}

HistoryList.propTypes = {
  servers: PropTypes.arrayOf(PropTypes.object),
  setElidForEditModal: PropTypes.func,
  setActiveServer: PropTypes.func,
  activeServerID: PropTypes.string,
}
