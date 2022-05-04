import React from 'react'
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
}) {
  const { t } = useTranslation('trusted_users')

  const validationSchema = Yup.object().shape({
    name:
      formName !== 'settings' &&
      Yup.string()
        .matches(
          /^[^!@#$%^&*()\]~+/}[{=?|".':;]+$/g,
          t('trusted_users.form_errors.full_name'),
        )
        .required(t('trusted_users.form_warnings.full_name')),
    phone: Yup.string()
      .matches(
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
        t('trusted_users.form_errors.phone'),
      )
      .min(7, t('trusted_users.form_errors.phone'))
      .required(t('trusted_users.form_warnings.phone')),
    email:
      formName !== 'settings' &&
      Yup.string()
        .email(t('trusted_users.form_errors.email'))
        .required(t('trusted_users.form_warnings.email')),
    password: Yup.string()
      .min(6, t('trusted_users.form_errors.password'))
      .max(48, t('trusted_users.form_errors.password_toolong'))
      .required(t('trusted_users.form_warnings.password'))
      .matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/, t('trusted_users.form_errors.password')),
    passConfirmation: Yup.string()
      .oneOf([Yup.ref('password')], t('trusted_users.form_errors.conf_password'))
      .required(t('trusted_users.form_warnings.conf_password')),
  })

  return (
    <div data-testid={dataTestid}>
      <div className={s.form_wrapper}>
        <div className={s.form}>
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
              email: '',
              name: '',
              phone: '',
              password: '',
              passConfirmation: '',
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {({ errors, touched, handleBlur, setFieldValue }) => {
              return (
                <Form>
                  <InputField
                    dataTestid="input_email"
                    label={requiredLabel(t('trusted_users.form.email'))}
                    placeholder={
                      formName === 'settings'
                        ? email
                        : t('trusted_users.form_placeholders.email')
                    }
                    name="email"
                    error={!!errors.email}
                    touched={!!touched.email}
                    className={s.field_input}
                    isShadow={true}
                    background={true}
                    autoComplete
                    disabled={formName === 'settings'}
                  />

                  <InputField
                    dataTestid="input_name"
                    label={requiredLabel(t('trusted_users.form.full_name'))}
                    placeholder={
                      formName === 'settings'
                        ? userName
                        : t('trusted_users.form_placeholders.full_name')
                    }
                    name="name"
                    error={!!errors.name}
                    touched={!!touched.name}
                    className={s.field_input}
                    isShadow={true}
                    background={true}
                    disabled={formName === 'settings'}
                  />

                  <CustomPhoneInput
                    label={requiredLabel(t('trusted_users.form.phone'))}
                    dataTestid="input_phone"
                    handleBlur={handleBlur}
                    setFieldValue={setFieldValue}
                    name="phone"
                  />

                  <InputField
                    dataTestid="input_password"
                    label={requiredLabel(t('trusted_users.form.password'))}
                    placeholder={t('trusted_users.form_placeholders.password')}
                    name="password"
                    error={!!errors.password}
                    touched={!!touched.password}
                    type="password"
                    className={s.field_input}
                    isShadow={true}
                    background={true}
                  />

                  <InputField
                    dataTestid="input_passConfirmation"
                    label={requiredLabel(t('trusted_users.form.conf_password'))}
                    placeholder={t('trusted_users.form_placeholders.conf_password')}
                    name="passConfirmation"
                    error={!!errors.passConfirmation}
                    touched={!!touched.passConfirmation}
                    type="password"
                    className={s.field_input}
                    isShadow={true}
                    background={true}
                  />
                  <Button
                    dataTestid="btn_form_submit"
                    size="large"
                    className={classNames({ [s.submit_btn]: true, [s.btn]: true })}
                    label={t('trusted_users.form.submit_btn').toUpperCase()}
                    type="submit"
                  />
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
  name: PropTypes.string,
}
