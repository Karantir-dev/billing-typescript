import { Button, InputField, Modal } from '@components'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import s from './Modals.module.scss'
import { getInstanceMainInfo } from '@utils'

export const EditNameModal = ({ item, closeModal, onSubmit }) => {
  const { t } = useTranslation(['cloud_vps', 'vds', 'other'])
  const { displayName } = getInstanceMainInfo(item)

  const validationSchema = Yup.object().shape({
    servername: Yup.string().required(t('Is a required field', { ns: 'other' })),
  })

  return (
    <Modal isOpen={!!item} closeModal={closeModal} isClickOutside>
      <Modal.Header>
        <p>{t('Rename')}</p>
        <p className={s.modal__subtitle}>
          <span className={s.modal__subtitle_transparent}>{t('instance')}:</span>{' '}
          {displayName}
        </p>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ servername: item.servername?.$ || '' }}
          validationSchema={validationSchema}
          onSubmit={values => {
            if (values.servername === item.servername?.$) return closeModal()
            onSubmit({ value: values.servername, elid: item.id.$, closeModal })
          }}
        >
          {({ errors, touched }) => {
            return (
              <Form id={'edit_name'}>
                <div>
                  <InputField
                    inputClassName={s.input}
                    name="servername"
                    isShadow
                    label={`${t('name', { ns: 'vds' })}:`}
                    placeholder={t('server_placeholder', { ns: 'vds' })}
                    error={!!errors.servername}
                    touched={!!touched.servername}
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
          size={'large'}
          type="submit"
          form={'edit_name'}
          isShadow
        />
        <button type="button" onClick={closeModal}>
          {t('Cancel')}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
