/* eslint-disable no-unused-vars */

import { Button, InputField, Modal, Icon, MessageInput } from '@components'
import { SSH_KEY_NAME_REGEX } from '@utils/constants'

import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import s from './Modals.module.scss'
import cn from 'classnames'

export const AddSshKeyModal = ({ isAddModalOpened, closeModal, onSubmit }) => {
  const { t } = useTranslation('cloud_vps', 'other', 'user_settings')

  const validationSchema = Yup.object().shape({
    comment: Yup.string()
      .required(t('Is a required field', { ns: 'other' }))
      .max(32, t('Name can have no more than'))
      .matches(
        SSH_KEY_NAME_REGEX,
        t('Name can only contain'),
      ),
    publicKey: Yup.string().required(t('Is a required field', { ns: 'other' })),
  })

  return (
    <Modal isOpen={isAddModalOpened} closeModal={closeModal} isClickOutside>
      <Modal.Header>
        <div className={s.sshModal_headBlock}>
          <Icon name="Ssh_keys" />
          <p>{t('Add new SSH Key')}</p>
        </div>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{
            comment: '',
            publicKey: '',
          }}
          validationSchema={validationSchema}
          onSubmit={values => {
            onSubmit({ values, closeModal })
          }}
        >
          {({ values, errors, touched }) => {
            return (
              <Form id={'add_ssh'} className={cn(s.form, s.sshForm)}>
                <InputField
                  inputClassName={s.input}
                  name="comment"
                  isShadow
                  label={`${t('Name')}:`}
                  placeholder={t('Enter name', { ns: 'other' })}
                  error={!!errors.comment}
                  touched={!!touched.comment}
                  isRequired
                  autoComplete="off"
                />
                <MessageInput
                  message={values?.publicKey}
                  enableFiles={false}
                  name={'publicKey'}
                  textareaClassName={s.sshAreaInput}
                  placeholderText={t('Enter your SSH key')}
                  label={`${t('ssh_key')}:`}
                  isRequired
                />
              </Form>
            )
          }}
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        <Button
          label={t('Save key', { ns: 'user_settings' })}
          size={'large'}
          type="submit"
          form={'add_ssh'}
          isShadow
        />
        <button type="button" onClick={closeModal}>
          {t('Cancel', { ns: 'other' })}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
