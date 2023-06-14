import * as Yup from 'yup'
import { Form, Formik } from 'formik'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import { InputField, Button } from '../..'
import CustomPhoneInput from '../../ui/CustomPhoneInput/CustomPhoneInput'

import s from './ManageUserForm.module.scss'
import classNames from 'classnames'

export default function ManageUserForm({
  controlForm,
  dataTestid,
  handleSubmit,
  title,
  subtitle,
  formName,
  email,
  userName,
  isUserFormActive,
  isEditUserAllowedToChange,
  userId,
}) {
  const { t } = useTranslation('trusted_users')

  const validationSchema =
    formName === 'settings'
      ? Yup.object().shape({
          ['name' + userId]: Yup.string().matches(
            /^[^!@#$%^&*()\]~+/}[{=?|".':;]+$/g,
            t('trusted_users.form_errors.full_name'),
          ),
          ['phone' + userId]: Yup.string()
            .matches(
              /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
              t('trusted_users.form_errors.phone'),
            )
            .min(7, t('trusted_users.form_errors.phone')),
          ['email' + userId]: Yup.string().email(t('trusted_users.form_errors.email')),
          ['password' + userId]: Yup.string()
            .min(12, t('trusted_users.form_errors.password'))
            .max(48, t('trusted_users.form_errors.password_toolong'))
            .matches(
              /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/,
              t('trusted_users.form_errors.password'),
            ),
          ['passConfirmation' + userId]: Yup.string().oneOf(
            [Yup.ref(`password${userId}`)],
            t('trusted_users.form_errors.conf_password'),
          ),
        })
      : Yup.object().shape({
          ['name' + userId]: Yup.string()
            .matches(
              /^[^!@#$%^&*()\]~+/}[{=?|".':;]+$/g,
              t('trusted_users.form_errors.full_name'),
            )
            .required(t('trusted_users.form_warnings.full_name')),
          ['phone' + userId]: Yup.string()
            .matches(
              /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
              t('trusted_users.form_errors.phone'),
            )
            .min(7, t('trusted_users.form_errors.phone'))
            .required(t('trusted_users.form_warnings.phone')),
          ['email' + userId]: Yup.string()
            .email(t('trusted_users.form_errors.email'))
            .required(t('trusted_users.form_warnings.email')),
          ['password' + userId]: Yup.string()
            .min(12, t('trusted_users.form_errors.password'))
            .max(48, t('trusted_users.form_errors.password_toolong'))
            .required(t('trusted_users.form_warnings.password'))
            .matches(
              /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/,
              t('trusted_users.form_errors.password'),
            ),
          ['passConfirmation' + userId]: Yup.string()
            .oneOf(
              [Yup.ref(`password${userId}`)],
              t('trusted_users.form_errors.conf_password'),
            )
            .required(t('trusted_users.form_warnings.conf_password')),
        })

  return (
    <div data-testid={dataTestid}>
      <div
        className={classNames({ [s.form_wrapper]: true, [s.active]: isUserFormActive })}
      >
        <div className={classNames({ [s.modal]: true, [s.active]: isUserFormActive })}>
          <div className={s.form_title_wrapper}>
            <div className={s.title_wrapper}>
              <p className={s.form_title}>{title}</p>
              <p className={s.form_subtitle}>{subtitle}</p>
            </div>
            <div className={s.close_btn_wrapper}>
              <button className={s.close_btn} onClick={controlForm}></button>
            </div>
          </div>

          <Formik
            initialValues={{
              ['email' + userId]: '',
              ['name' + userId]: '',
              ['phone' + userId]: '',
              ['password' + userId]: '',
              ['passConfirmation' + userId]: '',
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {({ errors, touched, handleBlur, setFieldValue }) => {
              return (
                <Form>
                  <div className={s.form}>
                    <InputField
                      dataTestid="input_email"
                      label={
                        formName === 'settings'
                          ? `${t('trusted_users.form.email')}:`
                          : requiredLabel(`${t('trusted_users.form.email')}:`)
                      }
                      placeholder={
                        formName === 'settings'
                          ? email
                          : t('trusted_users.form_placeholders.email')
                      }
                      name={'email' + userId}
                      error={!!errors['email' + userId]}
                      touched={!!touched['email' + userId]}
                      isShadow={true}
                      background={true}
                      autoComplete="off"
                      disabled={formName === 'settings'}
                      inputClassName={s.field_bg}
                    />

                    <InputField
                      dataTestid="input_name"
                      label={
                        formName === 'settings'
                          ? `${t('trusted_users.form.full_name')}:`
                          : requiredLabel(`${t('trusted_users.form.full_name')}:`)
                      }
                      placeholder={
                        formName === 'settings'
                          ? userName
                          : t('trusted_users.form_placeholders.full_name')
                      }
                      name={'name' + userId}
                      error={!!errors['name' + userId]}
                      touched={!!touched['name' + userId]}
                      isShadow={true}
                      background={true}
                      disabled={formName === 'settings'}
                      inputClassName={s.field_bg}
                      autoComplete="off"
                    />

                    <CustomPhoneInput
                      label={
                        formName === 'settings'
                          ? `${t('trusted_users.form.phone')}:`
                          : requiredLabel(`${t('trusted_users.form.phone')}:`)
                      }
                      dataTestid="input_phone"
                      handleBlur={handleBlur}
                      setFieldValue={setFieldValue}
                      name={'phone' + userId}
                      userId={userId}
                      inputClass={s.field_bg}
                      buttonClass={s.phoneInputButton}
                      autoComplete="off"
                      containerClass={s.phoneInputContainer}
                    />

                    <InputField
                      dataTestid="input_password"
                      label={
                        formName === 'settings'
                          ? `${t('trusted_users.form.password')}:`
                          : requiredLabel(`${t('trusted_users.form.password')}:`)
                      }
                      placeholder={t('trusted_users.form_placeholders.password')}
                      autoComplete="off"
                      name={'password' + userId}
                      error={!!errors['password' + userId]}
                      touched={!!touched['password' + userId]}
                      type="password"
                      isShadow={true}
                      background={true}
                      inputClassName={s.field_bg}
                    />

                    <InputField
                      dataTestid="input_passConfirmation"
                      label={
                        formName === 'settings'
                          ? `${t('trusted_users.form.conf_password')}:`
                          : requiredLabel(`${t('trusted_users.form.conf_password')}:`)
                      }
                      placeholder={t('trusted_users.form_placeholders.conf_password')}
                      autoComplete="off"
                      name={'passConfirmation' + userId}
                      error={!!errors['passConfirmation' + userId]}
                      touched={!!touched['passConfirmation' + userId]}
                      type="password"
                      isShadow={true}
                      background={true}
                      inputClassName={s.field_bg}
                    />
                  </div>

                  <div className={s.btn_wrapper}>
                    <Button
                      dataTestid="btn_form_submit"
                      size="large"
                      className={classNames({
                        [s.submit_btn]: true,
                        [s.btn]: true,
                        [s.shown]:
                          formName === 'settings' ? isEditUserAllowedToChange : true,
                      })}
                      label={t('trusted_users.form.submit_btn').toUpperCase()}
                      type="submit"
                      disabled={!isEditUserAllowedToChange}
                      isShadow
                    />
                  </div>
                </Form>
              )
            }}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export function requiredLabel(labelName) {
  return (
    <>
      {labelName} {<span className={s.required_star}>*</span>}
    </>
  )
}

ManageUserForm.propTypes = {
  controlForm: PropTypes.func,
  dataTestid: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  userName: PropTypes.string,
  email: PropTypes.string,
  isUserFormActive: PropTypes.bool,
  formName: PropTypes.string,
  isEditUserAllowedToChange: PropTypes.bool,
  userId: PropTypes.string,
}

ManageUserForm.defaultProps = {
  userId: '',
  isEditUserAllowedToChange: true,
}
