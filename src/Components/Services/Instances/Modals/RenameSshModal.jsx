import { Button, InputField, Modal } from '@components'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import s from './Modals.module.scss'

export const RenameSshModal = ({ item, closeModal, onSubmit }) => {
  const { t } = useTranslation(['cloud_vps', 'vds', 'other'])

  const validationSchema = Yup.object().shape({
    comment: Yup.string().required(t('Is a required field', { ns: 'other' })),
  })

  return (
    <Modal isOpen={!!item} closeModal={closeModal} isClickOutside>
      <Modal.Header>
        <p>{t('Rename')}</p>
        <p className={s.modal__subtitle}>
          <span className={s.modal__subtitle_transparent}>{t('ssh_key')}:</span>{' '}
          {item?.comment?.$ || item?.fingerprint?.$}
        </p>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ comment: item?.comment?.$ || '' }}
          validationSchema={validationSchema}
          onSubmit={values => {
            if (values.comment === item?.comment?.$) return closeModal()
            onSubmit({ value: values.comment, elid: item.elid.$, closeModal })
          }}
        >
          {({ errors, touched }) => {
            return (
              <Form id={'edit_ssh_name'}>
                <div>
                  <InputField
                    inputClassName={s.input}
                    name="comment"
                    isShadow
                    label={`${t('name', { ns: 'vds' })}:`}
                    placeholder={t('server_placeholder', { ns: 'vds' })}
                    error={!!errors.comment}
                    touched={!!touched.comment}
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
          label={t('edit', { ns: 'other' })}
          size={'large'}
          type="submit"
          form={'edit_ssh_name'}
          isShadow
        />
        <button type="button" onClick={closeModal}>
          {t('Cancel', { ns: 'other' })}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
