import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import * as Yup from 'yup'

import { Link } from 'react-router-dom'

import * as routes from '../../routes'
import { Icon } from '../Icon'
import s from './SignupForm.module.scss'
import { ErrorMessage, Form, Formik } from 'formik'
import { ReCAPTCHA } from 'react-google-recaptcha'
import { RECAPTCHA_KEY } from '../../config/config'
import { InputField } from '../InputField/InputField'

export function SignupForm() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const recaptchaEl = useRef()

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('warnings.name_required')),
    email: Yup.string()
      .email(t('warnings.invalid_email'))
      .required(t('warnings.email_required')),
    password: Yup.string().required(t('warnings.password_required')),
    passConfirmation: Yup.string()
      .oneOf([Yup.ref('password')], t('warnings.mismatched_password'))
      .required(t('warnings.mismatched_password')),
    reCaptcha: Yup.string()
      .typeError(t('warnings.recaptcha'))
      .required(t('warnings.recaptcha')),
  })

  const handleSubmit = ({ email, password, reCaptcha }, { setFieldValue }) => {}

  return (
    <div className={s.form_wrapper}>
      <div className={s.auth_links_wrapper}>
        <span className={s.current_auth_link}>{t('registration')}</span>
        <Link className={s.auth_link} to={routes.REGISTRATION}>
          {t('logIn')}
        </Link>
      </div>

      <Formik
        initialValues={{ email: '', password: '', reCaptcha: '' }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ setFieldValue, errors, values, touched }) => {
          return (
            <Form className={s.form}>
              {/* {errMsg && (
                <div className={s.credentials_error}>{t(`warnings.${errMsg}`)}</div>
              )} */}

              <InputField
                label="email"
                icon="envelope"
                error={!!errors.email}
                touched={!!touched.email}
              />

              <InputField
                label="password"
                icon="padlock"
                error={!!errors.password}
                touched={!!touched.password}
                inputValue={!!values.password}
              />

              <div className={s.recaptcha_wrapper}>
                <ReCAPTCHA
                  className={s.captcha}
                  ref={recaptchaEl}
                  sitekey={RECAPTCHA_KEY}
                  onChange={value => {
                    setFieldValue('reCaptcha', value)
                  }}
                />
              </div>
              <ErrorMessage
                className={s.error_message}
                name="reCaptcha"
                component="span"
              />

              <button className={s.submit_btn} type="submit">
                <span className={s.btn_text}>{t('logIn')}</span>
              </button>
            </Form>
          )
        }}
      </Formik>

      <div>
        <p className={s.social_title}>{t('login_with')}</p>
        <ul className={s.social_list}>
          <li>
            <Icon name="facebook" width={32} height={32}></Icon>
          </li>
          <li>
            <Icon name="google" width={32} height={32}></Icon>
          </li>
          <li>
            <Icon name="vk" width={32} height={32}></Icon>
          </li>
        </ul>
      </div>
    </div>
  )
}
