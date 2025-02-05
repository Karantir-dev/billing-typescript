import { useRef, useState } from 'react'
import s from './PayersTable.module.scss'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Button, Icon, Modal } from '@components'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { useOutsideAlerter } from '@utils'
import { payersOperations } from '@redux'
import { useDispatch } from 'react-redux'

export default function Component(props) {
  const { id, name, status, editHanler } = props

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
    setIsDeleteModal(!isDeleteModal)
  }

  return (
    <>
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
          <Icon
            name="MoreDots"
            onClick={() => setIsOpened(!isOpened)}
            className={s.dotIcons}
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
            <button className={s.settings_btn} onClick={editHanler}>
              <div className={s.iconContainer}>
                <Icon name="Settings" />
              </div>
              <p className={s.setting_text}>{t('Edit')}</p>
            </button>
            <button className={s.settings_btn} onClick={() => setIsDeleteModal(true)}>
              <div className={s.iconContainer}>
                <Icon name="Delete" />
              </div>
              <p className={s.setting_text}>{t('Delete')}</p>
            </button>
          </div>
        </div>
      </div>

      <Modal
        simple
        isOpen={isDeleteModal}
        closeModal={() => setIsDeleteModal(false)}
        className={s.modal}
      >
        <Modal.Header />
        <Modal.Body>
          <div className={s.modalDeleteText}>
            {t('Are you sure you want to remove {{name}} from your list of payers?', {
              name: name,
            })}
          </div>
        </Modal.Body>
        <Modal.Footer column>
          <Button
            onClick={deletePayerHandler}
            className={s.deleteBtn}
            label={t('Delete')}
            type="button"
            isShadow
          />
          <button
            onClick={() => setIsDeleteModal(false)}
            type="button"
            className={s.cancel}
          >
            {t('Cancel', { ns: 'other' })}
          </button>
        </Modal.Footer>
      </Modal>
    </>
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
