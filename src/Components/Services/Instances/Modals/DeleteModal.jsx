/* eslint-disable no-unused-vars */
import { Button, Icon, InputField, Modal, WarningMessage } from '@components'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import s from './Modals.module.scss'
import cn from 'classnames'

export const DeleteModal = ({ item, closeModal, onSubmit }) => {
  const { t } = useTranslation(['cloud_vps', 'vds', 'other'])

  const validationSchema = Yup.object().shape({
    comfirm: Yup.string()
      .matches(/^Permanently delete$/, t('type_delete'))
      .required(t('Is a required field', {ns: 'other'})),
  })
  return (
    <Modal isOpen={!!item} closeModal={closeModal} isClickOutside>
      <Modal.Header>
        <p>{t('delete', { ns: 'other' })}</p>
        <p className={s.modal__subtitle}>
          <span className={s.modal__subtitle_transparent}>{t('instance')}:</span>{' '}
          {item.id.$}
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
          label={t('delete', { ns: 'other' })}
          size="small"
          type="submit"
          form={'delete'}
          isShadow
        />
        <button type="button" onClick={closeModal}>
          {t('Cancel', { ns: 'other' })}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
