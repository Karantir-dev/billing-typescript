import { Button, InputField, Modal, WarningMessage } from '@components'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import s from './Modals.module.scss'
import { getInstanceMainInfo } from '@utils'
import { DISALLOW_SPACE, PASS_REGEX, PASS_REGEX_ASCII } from '@utils/constants'

export const ChangePasswordModal = ({ item, closeModal, onSubmit }) => {
  const { t } = useTranslation(['cloud_vps', 'auth'])
  const { isWindows, displayName } = getInstanceMainInfo(item)

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, t('warnings.invalid_pass', { min: 8, max: 48, ns: 'auth' }))
      .max(48, t('warnings.invalid_pass', { min: 8, max: 48, ns: 'auth' }))
      .matches(PASS_REGEX_ASCII, t('warnings.invalid_ascii', { ns: 'auth' }))
      .matches(PASS_REGEX, t('warnings.invalid_pass', { min: 8, max: 48, ns: 'auth' }))
      .matches(DISALLOW_SPACE, t('warnings.disallow_space', { ns: 'auth' }))
      .required(t('warnings.password_required', { ns: 'auth' })),
  })

  return (
    <Modal isOpen={!!item} closeModal={closeModal}>
      <Modal.Header>
        <p>{t('change_password_title')}</p>
        <p className={s.modal__subtitle}>
          <span className={s.modal__subtitle_transparent}>{t('instance')}:</span>{' '}
          {displayName}
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
            {({ errors, touched, setFieldValue }) => {
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
                      generatePasswordValue={value => setFieldValue('password', value)}
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
          label={t('Confirm')}
          size={'large'}
          type="submit"
          form={'change_pass'}
          isShadow
          disabled={isWindows}
        />
        <button type="button" onClick={closeModal}>
          {t('Cancel')}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
