import React, { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Formik, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import ReCAPTCHA from 'react-google-recaptcha'

import { authOperations } from '../../Redux/auth/authOperations'
import { VerificationModal } from '../VerificationModal/VerificationModal'
import { Icon } from '../Icon'
import * as routes from '../../routes'
import { InputField } from '../InputField/InputField'
import { RECAPTCHA_KEY } from '../../config/config'

import s from './LoginForm.module.scss'

export function LoginForm() {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const recaptchaEl = useRef()
  const location = useLocation()

  const [errMsg, setErrMsg] = useState('')

  const handleSubmit = ({ email, password, reCaptcha }, { setFieldValue }) => {
    const resetRecaptcha = () => {
      recaptchaEl.current.reset()
      setFieldValue('reCaptcha', '')
    }

    dispatch(authOperations.login(email, password, reCaptcha, setErrMsg, resetRecaptcha))
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('warnings.invalid_email'))
      .required(t('warnings.email_required')),
    password: Yup.string().required(t('warnings.password_required')),
    reCaptcha: Yup.string()
      .typeError(t('warnings.recaptcha'))
      .required(t('warnings.recaptcha')),
  })

  return (
    <div className={s.form_wrapper}>
      <div className={s.auth_links_wrapper}>
        <span className={s.current_auth_link}>{t('logIn')}</span>
        <Link className={s.auth_link} to={routes.REGISTRATION}>
          {t('registration')}
        </Link>
      </div>
      <Formik
        initialValues={{ email: '', password: '', reCaptcha: '' }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ setFieldValue, errors, values, touched }) => {
          const resetRecaptcha = () => {
            recaptchaEl.current.reset()
            setFieldValue('reCaptcha', '')
          }
          return (
            <>
              <VerificationModal resetRecaptcha={resetRecaptcha} />
              <Form className={s.form}>
                {errMsg && (
                  <div className={s.credentials_error}>{t(`warnings.${errMsg}`)}</div>
                )}
                {location.state?.from === routes.CHANGE_PASSWORD && !errMsg && (
                  <div className={s.changed_pass}>{t('changed_pass')}</div>
                )}

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
                <Link className={s.reset_pass_link} to={routes.RESET_PASSWORD}>
                  {t('forgot_password')}
                </Link>
              </Form>
            </>
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
