import React, { useRef, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import ReCAPTCHA from 'react-google-recaptcha'
import { authOperations, authSelectors } from '../../../Redux'
import { VerificationModal, Button, InputField } from '../..'
import * as routes from '../../../routes'
import { RECAPTCHA_KEY } from '../../../config/config'
import { Facebook, Google, Vk } from '../../../images'

import s from './LoginForm.module.scss'

export default function LoginForm() {
  const { t } = useTranslation('auth')
  const dispatch = useDispatch()
  const formVisibility = useSelector(authSelectors.getTotpFormVisibility)

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

  const handleUserKeyPress = e => {
    if (e.keyCode === 9) {
      e.preventDefault()
    }
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .matches(/^[^!#$%^&*()\]~/}[{=?|"<>':;]+$/g, t('warnings.special_characters'))
      .required(t('warnings.email_required')),
    password: Yup.string().required(t('warnings.password_required')),
    reCaptcha: Yup.string().nullable().required(t('warnings.recaptcha')),
  })

  useEffect(() => {
    if (formVisibility === 'shown') {
      window.addEventListener('keydown', handleUserKeyPress)
    }

    return () => {
      window.removeEventListener('keydown', handleUserKeyPress)
    }
  }, [formVisibility])

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
        {({ setFieldValue, errors, touched }) => {
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
                {location.state?.from === routes.REGISTRATION && !errMsg && (
                  <div className={s.changed_pass}>{t('registration_success')}</div>
                )}

                <InputField
                  dataTestid="input_email"
                  label={t('email_label')}
                  placeholder={t('email_placeholder')}
                  iconLeft="envelope"
                  name="email"
                  error={!!errors.email}
                  touched={!!touched.email}
                  className={s.input_field_wrapper}
                  inputAuth
                  autoComplete
                />

                <InputField
                  dataTestid="input_password"
                  label={t('password_label')}
                  placeholder={t('password_placeholder')}
                  name="password"
                  type="password"
                  iconLeft="padlock"
                  className={s.input_field_wrapper}
                  error={!!errors.password}
                  inputAuth
                  touched={!!touched.password}
                />

                <ReCAPTCHA
                  className={s.captcha}
                  ref={recaptchaEl}
                  sitekey={RECAPTCHA_KEY}
                  onChange={value => {
                    setFieldValue('reCaptcha', value)
                  }}
                />

                <ErrorMessage
                  className={s.error_message}
                  name="reCaptcha"
                  component="span"
                />

                <Button
                  dataTestid="btn_form_submit"
                  className={s.submit_btn}
                  label={t('logIn')}
                  type="submit"
                  isShadow
                />

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
            <Facebook />
          </li>
          <li>
            <Google />
          </li>
          <li>
            <Vk />
          </li>
        </ul>
      </div>
    </div>
  )
}
