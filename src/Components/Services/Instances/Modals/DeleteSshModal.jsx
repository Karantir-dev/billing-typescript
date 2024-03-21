import { useTranslation } from 'react-i18next'
import { Form, Formik } from 'formik'
import { Button, Modal } from '@components'

import s from './Modals.module.scss'

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
        <Formik onSubmit={onSubmit}>
          <Form id={'ssh_delete'}>
            <p className={s.body__text}>{t('delete_ssh_key_text')}</p>
          </Form>
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        <Button
          label={t('Confirm', { ns: 'other' })}
          size={'small'}
          type="submit"
          form={'ssh_delete'}
          isShadow
        />
        <button type="button" onClick={closeModal}>
          {t('Cancel', { ns: 'other' })}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
