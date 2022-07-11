import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { ServerState } from '../../..'
import {
  MoreDots,
  Edit,
  Clock,
  Refund,
  ExitSign,
  Info,
  ChangeTariff,
} from '../../../../images'
import { useOutsideAlerter } from '../../../../utils'
import s from './SharedHostingTable.module.scss'

export default function Component(props) {
  const {
    id,
    domain,
    tariff,
    expiredate,
    cost,
    setSelctedItem,
    selected,
    el,
    historyVhostHandler,
    instructionVhostHandler,
    platformVhostHandler,
    prolongVhostHandler,
    editVhostHandler,
    changeTariffVhostHandler,
    ip,
    datacentername,
    rights,
  } = props
  const { t } = useTranslation(['domains', 'other', 'vds'])
  const mobile = useMediaQuery({ query: '(max-width: 1599px)' })

  const [isOpened, setIsOpened] = useState(false)
  const dropDownEl = useRef()

  const closeMenuHandler = () => {
    setIsOpened(!isOpened)
  }

  useOutsideAlerter(dropDownEl, isOpened, closeMenuHandler)

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
        {mobile && <div className={s.item_title}>{t('IP address')}:</div>}
        <div className={cn(s.item_text, s.second_item)}>{ip}</div>
      </div>
      <div className={s.tableBlockFourth}>
        {mobile && <div className={s.item_title}>{t('Tariff')}:</div>}
        <div className={cn(s.item_text, s.third_item)}>{tariff}</div>
      </div>
      <div className={s.tableBlockFifth}>
        {mobile && <div className={s.item_title}>{t('Data center')}:</div>}
        <div className={cn(s.item_text, s.third_item)}>{datacentername}</div>
      </div>
      <div className={s.tableBlockSixth}>
        {mobile && <div className={s.item_title}>{t('Valid until')}:</div>}
        <div className={cn(s.item_text, s.fourth_item)}>{expiredate}</div>
      </div>
      <div className={s.tableBlockSeventh}>
        {mobile && <div className={s.item_title}>{t('State')}:</div>}
        <ServerState server={el} />
      </div>
      <div className={s.tableBlockEighth}>
        {mobile && <div className={s.item_title}>{t('Price')}:</div>}
        <div className={cn(s.item_text, s.seventh_item)}>{cost}</div>
      </div>
      <div className={s.dots}>
        <MoreDots onClick={() => setIsOpened(!isOpened)} className={s.dotIcons} />

        <div
          role="button"
          tabIndex={0}
          onKeyDown={() => null}
          onClick={e => e.stopPropagation()}
          className={cn({
            [s.list]: true,
            [s.opened]: isOpened,
          })}
          ref={dropDownEl}
        >
          <button
            disabled={!rights?.edit}
            className={s.settings_btn}
            onClick={editVhostHandler}
          >
            <Edit />
            <p className={s.setting_text}>{t('edit', { ns: 'other' })}</p>
          </button>
          <button
            disabled={!rights?.changepricelist}
            className={s.settings_btn}
            onClick={changeTariffVhostHandler}
          >
            <ChangeTariff />
            <p className={s.setting_text}>
              {t('trusted_users.Change tariff', { ns: 'trusted_users' })}
            </p>
          </button>
          <button
            disabled={!rights?.prolong}
            className={s.settings_btn}
            onClick={prolongVhostHandler}
          >
            <Clock />
            <p className={s.setting_text}>{t('prolong', { ns: 'vds' })}</p>
          </button>
          <button
            disabled={!rights?.history}
            className={s.settings_btn}
            onClick={historyVhostHandler}
          >
            <Refund />
            <p className={s.setting_text}>{t('history', { ns: 'vds' })}</p>
          </button>
          <button
            disabled={!rights?.instruction}
            className={s.settings_btn}
            onClick={instructionVhostHandler}
          >
            <Info />
            <p className={s.setting_text}>{t('instruction', { ns: 'vds' })}</p>
          </button>
          <button
            disabled={!rights?.gotoserver}
            className={s.settings_btn}
            onClick={platformVhostHandler}
          >
            <ExitSign />
            <p className={s.setting_text}>{t('go_to_panel', { ns: 'vds' })}</p>
          </button>
        </div>
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
  rights: PropTypes.object,
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