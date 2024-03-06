/* eslint-disable no-unused-vars */
import { Button, InputField, Modal } from '@components'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import s from './Modals.module.scss'
import cn from 'classnames'

export const ChangePasswordModal = ({ changePasswordModal, setChangePasswordModal }) => {
  const { t } = useTranslation()

  const changePassValidationSchema = Yup.object().shape({
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
    <Modal
      isOpen={!!changePasswordModal}
      closeModal={() => setChangePasswordModal(false)}
      isClickOutside
    >
      <Modal.Header>
        <p>Change admin password</p>
        <p className={s.modal__subtitle}>
          <span className={s.modal__subtitle_transparent}>Instance:</span>{' '}
          {changePasswordModal}
        </p>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ password: '' }}
          onSubmit={() => {
            setChangePasswordModal(false)
          }}
          validationSchema={changePassValidationSchema}
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
                    label={`${t('new_password')}:`}
                    placeholder={t('new_password_placeholder')}
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
      </Modal.Body>
      <Modal.Footer>
        <Button
          label="Change Password"
          size={'large'}
          type="submit"
          form={'change_pass'}
          isShadow
        />
        <button type="button" onClick={() => setChangePasswordModal(false)}>
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  )
}
