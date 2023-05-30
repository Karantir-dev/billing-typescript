import React, { useRef, useState } from 'react'
import s from './PaymentsMethodsTable.module.scss'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { MoreDots, Delete, Reload } from '../../../images'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { useOutsideAlerter } from '../../../utils'
import { EditCell } from '../../../Components'

export default function Component(props) {
  const {
    id,
    name,
    fullname,
    customname,
    num_prolong_items,
    status,
    paymethod_name,
    reconfigHandler,
    deleteItemHandler,
    editItemNameHandler,
  } = props
  const { t } = useTranslation(['billing', 'other', 'domains', 'vds'])
  const mobile = useMediaQuery({ query: '(max-width: 1023px)' })

  const dropDownEl = useRef()
  const [isOpened, setIsOpened] = useState(false)

  const closeMenuHandler = () => {
    setIsOpened(!isOpened)
  }

  useOutsideAlerter(dropDownEl, isOpened, closeMenuHandler)

  const renderStatus = string => {
    const status = string?.trim()
    let color = '#11A63A'
    if (status === 'Configuring') {
      color = '#ED801B'
    } else if (status === 'Enabled') {
      color = '#45A884'
    } else if (status === 'Disabled') {
      color = '#D93F21'
    }
    return {
      color,
    }
  }

  const reconfig = () => {
    reconfigHandler(id, name)
    setIsOpened(false)
  }

  const deleteHandler = () => {
    deleteItemHandler(id)
    setIsOpened(false)
  }

  const editNameHandler = value => {
    editItemNameHandler(id, value)
  }

  const renderDesktopLastColumn = () => {
    return (
      <div className={cn(s.item_text, s.eighth_item)}>
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
          <button className={s.settings_btn} onClick={reconfig}>
            <Reload />
            <p className={s.setting_text}>{t('Re-configure')}</p>
          </button>

          <button className={s.settings_btn} onClick={deleteHandler}>
            <Delete />
            <p className={s.setting_text}>{t('Delete')}</p>
          </button>
        </div>
      </div>
    )
  }

  const paymentName = t(customname?.trim() || name?.trim() || fullname?.trim(), {
    ns: 'vds',
  })

  return (
    <div className={cn(s.item)}>
      <div className={s.tableBlockFirst}>
        {mobile && <div className={s.item_title}>{t('Name')}:</div>}
        {fullname?.trim() === 'Personal account' ? (
          <span className={s.personal_account}>{paymentName}</span>
        ) : (
          <EditCell
            originName={fullname}
            onSubmit={editNameHandler}
            placeholder={paymentName}
            isShadow={!mobile}
            lettersAmount={25}
            className={s.edit_cell}
          />
        )}
      </div>
      <div className={s.tableBlockSecond}>
        {mobile && (
          <div className={s.item_title}>{t('Payment method', { ns: 'other' })}:</div>
        )}
        <div className={cn(s.item_text, s.second_item)}>{paymethod_name || '-'}</div>
      </div>
      <div className={s.tableBlockThird}>
        {mobile && (
          <div className={s.item_title}>
            {t('Number of auto-renewable services', { ns: 'other' })}:
          </div>
        )}
        <div className={cn(s.item_text, s.third_item)}>{num_prolong_items}</div>
      </div>
      <div className={s.tableBlockFourth}>
        {mobile && <div className={s.item_title}>{t('status', { ns: 'other' })}:</div>}
        <div
          style={status ? { color: renderStatus(status).color } : {}}
          className={cn(s.item_text, s.fourth_item)}
        >
          {t(status?.trim() || '-', { ns: 'domains' })}
        </div>
      </div>
      {fullname?.trim() !== 'Personal account' && (
        <div className={s.tableBlockFifth}>{renderDesktopLastColumn()}</div>
      )}
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
