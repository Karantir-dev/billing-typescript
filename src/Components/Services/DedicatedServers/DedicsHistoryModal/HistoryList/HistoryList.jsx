import React from 'react'
// import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import PropTypes from 'prop-types'

import s from './HistoryList.module.scss'
import HistoryListItem from '../HistoryListItem/HistoryListItem'
import HistoryMobileListItem from '../HistoryMobileListItem/HistoryMobileListItem'

export default function HistoryList({ historyList }) {
  const widerThan1024 = useMediaQuery({ query: '(min-width: 1024px)' })

  return (
    <ul className={s.list}>
      {historyList?.map((el, index) => {
        return widerThan1024 ? (
          <HistoryListItem key={index} history={el} />
        ) : (
          <HistoryMobileListItem key={index} history={el} />
        )
      })}
    </ul>
  )
}

HistoryList.propTypes = {
  servers: PropTypes.arrayOf(PropTypes.object),
  setElidForEditModal: PropTypes.func,
  setActiveServer: PropTypes.func,
  activeServerID: PropTypes.string,
}
