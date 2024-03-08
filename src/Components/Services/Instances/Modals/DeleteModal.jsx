/* eslint-disable no-unused-vars */
import { Button, Icon, InputField, Modal } from '@components'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import s from './Modals.module.scss'
import cn from 'classnames'

export const DeleteModal = ({ item, closeModal, onSubmit }) => {
  const { t } = useTranslation()

  const validationSchema = Yup.object().shape({
    comfirm: Yup.string()
      .matches(/^Permanently delete$/, 'invalid value')
      .required(t('required')),
  })
  return (
    <Modal isOpen={!!item} closeModal={closeModal} isClickOutside>
      <Modal.Header>
        <p>Delete</p>
        <p className={s.modal__subtitle}>
          <span className={s.modal__subtitle_transparent}>Instance:</span> {item.id.$}
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
                  <p className={s.body__text}>
                    Are you sure you want to delete the instance?
                  </p>
                  <p className={s.warning}>
                    <Icon name="Attention" />
                    Files will be permanently lost. To delete an istance, you must type
                    “Permanently delete”.
                  </p>
                  <InputField
                    inputClassName={s.input}
                    name="comfirm"
                    isShadow
                    placeholder={t('Permanently delete')}
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
        <Button label="Delete" size="small" type="submit" form={'delete'} isShadow />
        <button type="button" onClick={closeModal}>
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  )
}
