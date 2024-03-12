/* eslint-disable no-unused-vars */
import { Button, InputField, Modal } from '@components'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import s from './Modals.module.scss'
import cn from 'classnames'

export const EditNameModal = ({ item, closeModal, onSubmit }) => {
  const { t } = useTranslation()

  return (
    <Modal isOpen={!!item} closeModal={closeModal} isClickOutside>
      <Modal.Header>
        <p>Edit Name</p>
        <p className={s.modal__subtitle}>
          <span className={s.modal__subtitle_transparent}>Instance:</span>{' '}
          {item.servername?.$ || item.id.$}
        </p>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ servername: item.servername?.$ || '' }}
          onSubmit={values => {
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
                    label={`${t('name')}:`}
                    placeholder={t('server_placeholder')}
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
        <Button label="Edit" size={'large'} type="submit" form={'edit_name'} isShadow />
        <button type="button" onClick={closeModal}>
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  )
}
