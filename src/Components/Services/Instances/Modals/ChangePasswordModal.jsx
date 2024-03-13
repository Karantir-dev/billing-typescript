/* eslint-disable no-unused-vars */
import { Button, InputField, Modal, WarningMessage } from '@components'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import s from './Modals.module.scss'
import cn from 'classnames'

export const ChangePasswordModal = ({ item, closeModal, onSubmit }) => {
  const { t } = useTranslation(['cloud_vps', 'vps', 'auth', 'other'])
  const isWindows = item.instances_os?.$.includes('Windows')

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, t('warnings.invalid_pass', { ns: 'auth', min: 6, max: 48 }))
      .max(48, t('warnings.invalid_pass', { ns: 'auth', min: 6, max: 48 }))
      .matches(
        /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/,
        t('warnings.invalid_pass', { ns: 'auth', min: 6, max: 48 }),
      )
      .required(t('warnings.password_required', { ns: 'auth' })),
  })

  return (
    <Modal isOpen={!!item} closeModal={closeModal} isClickOutside>
      <Modal.Header>
        <p>{t('change_password_title')}</p>
        <p className={s.modal__subtitle}>
          <span className={s.modal__subtitle_transparent}>{t('instance')}:</span>{' '}
          {item.servername?.$ || item.name.$}
        </p>
      </Modal.Header>
      <Modal.Body>
        {isWindows ? (
          <WarningMessage>{t('windows_password_warning')}</WarningMessage>
        ) : (
          <Formik
            initialValues={{ password: '' }}
            onSubmit={values => onSubmit(values.password)}
            validationSchema={validationSchema}
          >
            {({ errors, touched }) => {
              return (
                <Form id={'change_pass'}>
                  <div>
                    <InputField
                      inputClassName={s.input}
                      name="password"
                      isShadow
                      type="password"
                      label={`${t('new_password', { ns: 'vds' })}:`}
                      placeholder={t('new_password_placeholder', { ns: 'vds' })}
                      error={!!errors.password}
                      touched={!!touched.password}
                      isRequired
                      autoComplete="off"
                    />
                  </div>
                </Form>
              )
            }}
          </Formik>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          label={t('Change password')}
          size={'large'}
          type="submit"
          form={'change_pass'}
          isShadow
          disabled={isWindows}
        />
        <button type="button" onClick={closeModal}>
          {t('Cancel', { ns: 'other' })}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
