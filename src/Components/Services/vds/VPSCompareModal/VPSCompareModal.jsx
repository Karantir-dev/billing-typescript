import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import * as route from '@src/routes'

import s from './VPSCompareModal.module.scss'

import { Button, Modal } from '@components'

export default function VPSCompareModal({ isOpen, closeModal }) {
  const { t } = useTranslation(['vds', 'other'])

  const navigate = useNavigate()

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} isClickOutside>
      <Modal.Header>
        <p className={s.title}>{t('compare_modal_title')}</p>
      </Modal.Header>
      <Modal.Body>
        <div className={s.modal_wrapper}>{t('compare_modal_text')}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className={s.buy_btn}
          type="button"
          isShadow
          textClassName={s.buy_btn_text}
          label={t('to_order', { ns: 'other' }) + ' Premium Cloud VPS'}
          onClick={() => {
            navigate(route.CLOUD_VPS_CREATE_PREMIUM_INSTANCE)
          }}
        />
        <Button
          className={s.buy_btn}
          type="button"
          isShadow
          textClassName={s.buy_btn_text}
          label={t('to_order', { ns: 'other' }) + ' Basic Cloud VPS'}
          onClick={() => {
            navigate(route.CLOUD_VPS_CREATE_BASIC_INSTANCE)
          }}
        />
      </Modal.Footer>
    </Modal>
  )
}
