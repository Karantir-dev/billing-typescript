import { Button, InputField, Modal, WarningMessage } from '@components'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import s from './Modals.module.scss'
import { getInstanceMainInfo } from '@utils'

export const DeleteModal = ({ item, closeModal, onSubmit }) => {
  const { t } = useTranslation(['cloud_vps', 'other'])
  const { displayName } = getInstanceMainInfo(item)

  const validationSchema = Yup.object().shape({
    comfirm: Yup.string()
      .matches(/^Permanently delete$/, t('type_delete'))
      .required(t('Is a required field', { ns: 'other' })),
  })
  return (
    <Modal isOpen={!!item} closeModal={closeModal} isClickOutside>
      <Modal.Header>
        <p>{t('delete', { ns: 'other' })}</p>
        <p className={s.modal__subtitle}>
          <span className={s.modal__subtitle_transparent}>{t('instance')}:</span>{' '}
          {displayName}
        </p>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ comfirm: '' }}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {({ errors, touched }) => {
            return (
              <Form id={'delete'}>
                <div>
                  <p className={s.body__text}>{t('delete_text')}</p>
                  <WarningMessage>{t('delete_warning')}</WarningMessage>

                  <InputField
                    inputClassName={s.input}
                    name="comfirm"
                    isShadow
                    placeholder="Permanently delete"
                    error={!!errors.comfirm}
                    touched={!!touched.comfirm}
                    isRequired
                    autoComplete="off"
                  />
                </div>
              </Form>
            )
          }}
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        <Button
          label={t('Confirm')}
          size="small"
          type="submit"
          form={'delete'}
          isShadow
        />
        <button type="button" onClick={closeModal}>
          {t('Cancel')}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
