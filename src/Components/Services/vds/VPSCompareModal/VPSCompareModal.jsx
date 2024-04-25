/* eslint-disable no-unused-vars */
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import * as route from '@src/routes'

import cn from 'classnames'
import s from './VPSCompareModal.module.scss'

import { Button, Modal } from '@components'

export default function VPSCompareModal({ isOpen, closeModal }) {
  const { t } = useTranslation(['vds', 'other'])

  const navigate = useNavigate()
  return (
    <Modal isOpen={isOpen} closeModal={closeModal} isClickOutside className={''}>
      <Modal.Header>
        <p className={s.title}>Compare VPS and Cloud VPS</p>
      </Modal.Header>
      <Modal.Body>
        <div className={s.modal_wrapper}>
          here will be compatison information with VPS and Cloud VPS
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className={s.buy_btn}
          type="button"
          isShadow
          label={t('to_order', { ns: 'other' }) + ' Cloud VPS'}
          onClick={() => navigate(route.CLOUD_VPS_CREATE_INSTANCE)}
        />
      </Modal.Footer>
    </Modal>
  )
}
