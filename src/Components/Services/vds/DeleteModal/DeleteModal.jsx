import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Modal } from '@components'
import PropTypes from 'prop-types'
import cn from 'classnames'

import s from './DeleteModal.module.scss'

export default function DeleteModal({
  closeModal,
  names,
  isDeleteLater = false,
  deleteFn,
  isOpen,
  isDedic,
}) {
  const { t } = useTranslation(['vds', 'other'])
  const [namesOpened, setNamesOpened] = useState(false)
  const [firstRender, setFirstRender] = useState(true)
  const namesBlock = useRef()

  useEffect(() => {
    if (!namesOpened) {
      namesBlock.current.style.height =
        namesBlock.current.firstElementChild.scrollHeight + 'px'
      !firstRender && namesBlock.current.firstElementChild.scrollIntoView()
    } else {
      const openedHeight =
        namesBlock.current.scrollHeight > 260
          ? 260 + 'px'
          : namesBlock.current.scrollHeight + 'px'
      namesBlock.current.style.height = openedHeight
    }
  }, [namesOpened])

  useEffect(() => {
    setFirstRender(false)
  }, [])

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} simple isClickOutside>
      <Modal.Header />
      <Modal.Body>
        <p className={s.title}>{t('attention')}!</p>
        <p className={s.text}>{t('delete_message')}?</p>
        {isDeleteLater &&
          (isDedic ? (
            <p className={s.warn}>{t('warn_message_dedic')}</p>
          ) : (
            <p className={s.warn}>{t('warn_message')}</p>
          ))}
        <div>
          <p className={cn(s.names_block, { [s.opened]: namesOpened })} ref={namesBlock}>
            {names.map((name, idx) => {
              return (
                <span className={s.name_item} key={name}>
                  {name}
                  {names.length - 1 === idx ? '' : ','}
                </span>
              )
            })}
          </p>
          {names.length > 1 && (
            <button
              className={s.btn_more}
              type="button"
              onClick={() => setNamesOpened(!namesOpened)}
            >
              {namesOpened
                ? t('collapse', { ns: 'other' })
                : t('and_more', { ns: 'other', value: names.length - 1 })}
            </button>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className={s.cancel_btn}
          onClick={closeModal}
          isShadow
          label={t('Cancel', { ns: 'other' })}
        />

        <button className={s.delete_btn} type="button" onClick={deleteFn}>
          {t('delete', { ns: 'other' })}
        </button>
      </Modal.Footer>
    </Modal>
  )
}

DeleteModal.propTypes = {
  names: PropTypes.array.isRequired,
  closeModal: PropTypes.func.isRequired,
  deleteFn: PropTypes.func.isRequired,
}
