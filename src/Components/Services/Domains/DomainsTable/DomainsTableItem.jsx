import { useState, useRef } from 'react'
import s from './DomainsTable.module.scss'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { ServerState, CheckBox } from '../../../'
import { MoreDots, Edit, Clock, Refund, Whois, DomainsListName } from '@images'
import { useOutsideAlerter } from '@utils'

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
    editDomainHandler,
    renewDomainHandler,
    historyDomainHandler,
    whoisDomainHandler,
    NSDomainHandler,
    rights,
  } = props
  const { t } = useTranslation(['domains', 'other', 'vds'])
  const mobile = useMediaQuery({ query: '(max-width: 1549px)' })

  const [isOpened, setIsOpened] = useState(false)
  const dropDownEl = useRef()

  const closeMenuHandler = () => {
    setIsOpened(!isOpened)
  }

  useOutsideAlerter(dropDownEl, isOpened, closeMenuHandler)

  const isActive = selected?.includes(el)
  const toggleIsActiveHandler = () => setSelctedItem(!isActive, el)

  return (
    <div className={s.item}>
      <div className={s.checkBoxColumn}>
        <CheckBox
          className={s.check_box}
          value={isActive}
          onClick={toggleIsActiveHandler}
        />
      </div>
      <div className={s.columnsWithoutCheckBox}>
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
          <div className={cn(s.item_text, s.seventh_item)}>
            {cost.replace('Year', t('Year', { ns: 'other' }))}
          </div>
        </div>
        <div className={s.dots}>
          <MoreDots
            onClick={() => setIsOpened(!isOpened)}
            className={cn(s.dotIcons, { [s.opened]: isOpened })}
          />

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
              onClick={() => editDomainHandler(id)}
            >
              <Edit />
              <p className={s.setting_text}>{t('edit', { ns: 'other' })}</p>
            </button>
            <button
              disabled={!rights?.prolong}
              className={s.settings_btn}
              onClick={() => renewDomainHandler(id)}
            >
              <Clock />
              <p className={s.setting_text}>{t('prolong', { ns: 'vds' })}</p>
            </button>
            <button
              disabled={!rights?.history}
              className={s.settings_btn}
              onClick={() => historyDomainHandler(id)}
            >
              <Refund />
              <p className={s.setting_text}>{t('history', { ns: 'vds' })}</p>
            </button>
            <button
              disabled={!rights?.whois}
              className={s.settings_btn}
              onClick={() => whoisDomainHandler(id)}
            >
              <Whois />
              <p className={s.setting_text}>{t('whois')}</p>
            </button>
            <button
              disabled={!rights?.ns}
              className={s.settings_btn}
              onClick={() => NSDomainHandler(id)}
            >
              <DomainsListName />
              <p className={s.setting_text}>
                {t('View/change the list of name servers')}
              </p>
            </button>
          </div>
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
  selected: PropTypes.array,
  rights: PropTypes.object,
}

Component.defaultProps = {
  id: '',
  theme: '',
  date: '',
  status: '',
  unread: false,
  setSelctedTicket: () => null,
  selected: [],
}
