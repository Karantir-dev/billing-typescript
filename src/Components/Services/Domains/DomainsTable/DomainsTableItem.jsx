import React from 'react'
import s from './DomainsTable.module.scss'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { ServerState } from '../../../'

export default function Component(props) {
  const { id, domain, tariff, expiredate, cost, setSelctedItem, selected, el } = props
  const { t } = useTranslation(['domains', 'other'])
  const mobile = useMediaQuery({ query: '(max-width: 1023px)' })

  return (
    <div
      data-testid="archive_item"
      role="button"
      tabIndex={0}
      onKeyDown={() => {}}
      onClick={() => setSelctedItem(id)}
      className={cn(s.item, { [s.selected]: selected })}
    >
      <div className={s.tableBlockFirst}>
        {mobile && <div className={s.item_title}>{t('Id')}:</div>}
        <div className={cn(s.item_text, s.first_item)}>{id}</div>
      </div>
      <div className={s.tableBlockSecond}>
        {mobile && <div className={s.item_title}>{t('Domain name')}:</div>}
        <div className={cn(s.item_text, s.second_item)}>{domain}</div>
      </div>
      <div className={s.tableBlockThird}>
        {mobile && <div className={s.item_title}>{t('Tariff')}:</div>}
        <div className={cn(s.item_text, s.third_item)}>{tariff}</div>
      </div>
      <div className={s.tableBlockFourth}>
        {mobile && <div className={s.item_title}>{t('Valid until')}:</div>}
        <div className={cn(s.item_text, s.fourth_item)}>{expiredate}</div>
      </div>
      <div className={s.tableBlockFifth}>
        {mobile && <div className={s.item_title}>{t('State')}:</div>}
        <ServerState server={el} />
      </div>
      <div className={s.tableBlockSixth}>
        {mobile && <div className={s.item_title}>{t('Price')}:</div>}
        <div className={cn(s.item_text, s.seventh_item)}>{cost}</div>
      </div>
    </div>
  )
}
Component.propTypes = {
  id: PropTypes.string,
  theme: PropTypes.string,
  date: PropTypes.string,
  status: PropTypes.string,
  unread: PropTypes.bool,
  setSelctedTicket: PropTypes.func,
  selected: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.bool]),
}

Component.defaultProps = {
  id: '',
  theme: '',
  date: '',
  status: '',
  unread: false,
  setSelctedTicket: () => null,
  selected: null,
}
