import { Button, InputField, Modal, Icon, MessageInput } from '@components'
import { SSH_KEY_NAME_REGEX, CYRILLIC_ALPHABET_PROHIBITED } from '@utils/constants'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cloudVpsOperations, cloudVpsSelectors } from '@redux'

import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import s from './Modals.module.scss'
import cn from 'classnames'

export const SshKeyModal = ({ item, closeModal, onSubmit }) => {
  const { t } = useTranslation('cloud_vps', 'other', 'user_settings', 'auth')
  const dispatch = useDispatch()

  const mode = typeof item === 'object' ? 'edit' : 'add'

  const allSshCount = useSelector(cloudVpsSelectors.getSshCount)

  /* Dispatching all user ssh keys to check it names before sending request */
  useEffect(() => {
    const getAllKeys = true
    dispatch(
      cloudVpsOperations.getSshKeys({
        p_cnt: allSshCount,
        getAllKeys,
      }),
    )
  }, [])

  const allSshItems = useSelector(cloudVpsSelectors.getAllSshList)

  const validationSchema = Yup.object().shape({
    comment: Yup.string()
      .required(t('Is a required field', { ns: 'other' }))
      .test('trim', t('Name cannot consist spaces'), value => {
        if (value) {
          const trimmedValue = value.trim()
          return trimmedValue.length > 0
        }

        return true
      })
      .max(32, t('Name can have no more than'))
      .matches(SSH_KEY_NAME_REGEX, t('Name can only contain'))
      .test('unique', t('This name is already in use'), value => {
        if (mode === 'add') {
          return !allSshItems.some(item => item.comment.$ === value)
        }

        if (mode === 'edit') {
          const id = item?.elid?.$
          const editedItem = allSshItems.find(item => item.elid.$ === id)
          return (
            editedItem.comment.$ === value ||
            !allSshItems.some(item => item.comment.$ === value)
          )
        }
        return true
      }),
    publicKey: Yup.string()
      .required(t('Is a required field', { ns: 'other' }))
      .matches(
        CYRILLIC_ALPHABET_PROHIBITED,
        t('warnings.cyrillic_prohibited', { ns: 'auth' }),
      ),
  })

  return (
    <Modal isOpen={!!item} closeModal={closeModal} isClickOutside>
      <Modal.Header>
        <div className={s.sshModal_headBlock}>
          <Icon name="Ssh_keys" />
          {mode === 'edit' ? (
            <div>
              <p>{t('Rename')}</p>
              <p className={s.modal__subtitle}>
                <span className={s.modal__subtitle_transparent}>{t('ssh_key')}:</span>{' '}
                {item?.comment?.$}
              </p>
            </div>
          ) : (
            <p>{t('Add new SSH Key')}</p>
          )}
        </div>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{
            comment: item?.comment?.$ || '',
            publicKey: item?.publicKey?.$ || '',
          }}
          validationSchema={validationSchema}
          onSubmit={values => {
            const trimmedValue = values.comment.trim()
            onSubmit({ values: { comment: trimmedValue, ...values }, closeModal })
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
