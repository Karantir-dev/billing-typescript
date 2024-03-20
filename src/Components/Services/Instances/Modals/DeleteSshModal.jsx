/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Formik } from 'formik'
import { Button, Modal, WarningMessage } from '@components'

import s from './Modals.module.scss'
import cn from 'classnames'

export const DeleteSshModal = ({ item, closeModal, onSubmit }) => {
  const { t } = useTranslation(['cloud_vps', 'other'])

  return (
    <Modal isOpen={!!item} closeModal={closeModal} isClickOutside>
      <Modal.Header>
        <p>{t('delete', { ns: 'other' })}</p>
        <p className={s.modal__subtitle}>
          <span className={s.modal__subtitle_transparent}>{t('ssh_key')}:</span>{' '}
          {item?.comment?.$ || item?.fingerprint?.$}
        </p>
      </Modal.Header>
      <Modal.Body>
        <Formik initialValues={{ comfirm: '' }} onSubmit={onSubmit}>
          {() => {
            return (
              <Form id={'ssh_delete'}>
                <div>
                  <p className={s.body__text}>{t('delete_ssh_key_text')}</p>
                </div>
              </Form>
            )
          }}
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        <Button
          label={t('Yes')}
          size={'small'}
          onClick={() => onSubmit(item?.elid?.$)}
          isShadow
        />
        <button type="button" onClick={closeModal}>
          {t('No')}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
