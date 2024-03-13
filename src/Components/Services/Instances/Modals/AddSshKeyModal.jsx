/* eslint-disable no-unused-vars */
import { Button, InputField, Modal } from '@components'
import { Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import s from './Modals.module.scss'
import cn from 'classnames'

export const AddSshKeyModal = ({ isAddModalOpened, closeModal, onSubmit }) => {
  const { t } = useTranslation()

  return (
    <Modal isOpen={isAddModalOpened} closeModal={closeModal} isClickOutside>
      <Modal.Header>
        <p>Create new SSH Key</p>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{
            comment: '',
            publicKey: '',
          }}
          onSubmit={values => {
            onSubmit({ values, closeModal })
          }}
        >
          {({ errors, touched }) => {
            return (
              <Form id={'add_ssh'}>
                <div>
                  <InputField
                    inputClassName={s.input}
                    name="comment"
                    isShadow
                    label={`${t('Name')}:`}
                    placeholder={t('name')}
                    error={!!errors.servername}
                    touched={!!touched.servername}
                    autoComplete="off"
                  />
                  <InputField
                    inputClassName={s.input}
                    name="publicKey"
                    isShadow
                    label={`${t('Key')}:`}
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
        <Button label="Save Key" size={'large'} type="submit" form={'add_ssh'} isShadow />
        <button type="button" onClick={closeModal}>
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  )
}
