import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Modal } from '@components'
import cn from 'classnames'
import { useDispatch } from 'react-redux'
import { vdsOperations } from '@redux'

import s from './RebootModal.module.scss'

export default function RebootModal({ id, names, closeModal, isOpen }) {
  const { t } = useTranslation(['vds', 'dedicated_servers', 'other'])
  const dispatch = useDispatch()
  const [namesOpened, setNamesOpened] = useState(false)
  const [firstRender, setFirstRender] = useState(true)
  const namesBlock = useRef()

  const onRebootServer = () => {
    dispatch(vdsOperations.rebootServer(id))
    closeModal()
  }

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
        <p className={s.title}>{t('reload')}</p>
        <p className={s.text}>
          {t('Are you sure you want to restart the server', { ns: 'dedicated_servers' })}?
        </p>
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
          className={s.btn_save}
          onClick={onRebootServer}
          isShadow
          label={t('ok', { ns: 'other' })}
        />

        <button className={s.btn_cancel} onClick={closeModal} type="button">
          {t('Cancel', { ns: 'other' })}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
