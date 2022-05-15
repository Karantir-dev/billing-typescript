import React, { useRef, useState } from 'react'
import s from './PayersTable.module.scss'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { MoreDots, Delete, Settings, Cross } from '../../../images'
import { Button, Portal } from '../..'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { useOutsideAlerter } from '../../../utils'
import { payersOperations } from '../../../Redux'
import { useDispatch } from 'react-redux'

export default function Component(props) {
  const { id, name, status } = props

  const dispatch = useDispatch()

  const { t } = useTranslation(['payers', 'other'])

  const mobile = useMediaQuery({ query: '(max-width: 767px)' })

  const dropDownEl = useRef()
  const [isOpened, setIsOpened] = useState(false)
  const [isDeleteModal, setIsDeleteModal] = useState(false)

  const closeMenuHandler = () => {
    setIsOpened(!isOpened)
  }

  useOutsideAlerter(dropDownEl, isOpened, closeMenuHandler)

  const deletePayerHandler = () => {
    dispatch(payersOperations.deletePayer(id))
  }

  return (
    <div className={s.item}>
      <span className={s.tableBlockFirst}>
        {mobile && <div className={s.item_title}>{t('Id')}:</div>}
        <span className={cn(s.item_text, s.first_item)}>{id}</span>
      </span>
      <span className={s.tableBlockSecond}>
        {mobile && <div className={s.item_title}>{t('Name')}:</div>}
        <span className={cn(s.item_text, s.second_item)}>{name}</span>
      </span>
      <span className={s.tableBlockThird}>
        {mobile && <div className={s.item_title}>{t('Payer status')}:</div>}
        <span className={cn(s.item_text, s.fourth_item)}>{t(status)}</span>
      </span>
      <div className={s.tableBlockFourth}>
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
          <button className={s.settings_btn} onClick={() => null}>
            <Settings />
            <p className={s.setting_text}>{t('Edit')}</p>
          </button>
          <button className={s.settings_btn} onClick={() => setIsDeleteModal(true)}>
            <Delete />
            <p className={s.setting_text}>{t('Delete')}</p>
          </button>
        </div>
      </div>
      <Portal>
        {isDeleteModal && (
          <div className={s.modalBg}>
            <div className={s.modalBlock}>
              <button onClick={() => setIsDeleteModal(false)} className={s.closeBtn}>
                <Cross className={s.crossIcon} />
              </button>
              <div className={s.modalDeleteText}>
                {t('Are you sure you want to remove {{name}} from your list of payers?', {
                  name: name,
                })}
              </div>
              <Button
                onClick={deletePayerHandler}
                className={s.deleteBtn}
                label={t('Delete')}
                type="button"
              />
              <button
                onClick={() => setIsDeleteModal(false)}
                type="button"
                className={s.cancel}
              >
                {t('Cancel', { ns: 'other' })}
              </button>
            </div>
          </div>
        )}
      </Portal>
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
