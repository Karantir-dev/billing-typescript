import React, { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Formik, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import ReCAPTCHA from 'react-google-recaptcha'

import { authOperations } from '../../Redux/auth/authOperations'
import { Icon, InputField, VerificationModal } from '..'
import * as routes from '../../routes'
import { RECAPTCHA_KEY } from '../../config/config'

import s from './LoginForm.module.scss'

export default function LoginForm() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const tabletOrHigher = useMediaQuery({ query: '(min-width: 768px)' })
  const recaptchaEl = useRef()
  const location = useLocation()

  const [passShown, setPassShown] = useState(false)
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
                <div className={s.field_wrapper}>
                  <label className={s.label}>{t('email_label')}</label>
                  <div className={s.input_wrapper}>
                    <Field
                      className={cn({
                        [s.input]: true,
                        [s.error]: errors.email && touched.email,
                      })}
                      name="email"
                      type="text"
                      placeholder={t('email_placeholder')}
                    />
                    {tabletOrHigher && (
                      <Icon
                        className={s.field_icon}
                        name="envelope"
                        width={19}
                        height={15}
                      />
                    )}
                    <div className={s.input_border}></div>
                  </div>
                  <ErrorMessage
                    className={s.error_message}
                    name="email"
                    component="span"
                  />
                </div>

                <div className={s.field_wrapper}>
                  <label className={s.label}>{t('password_label')}</label>
                  <div className={s.input_wrapper}>
                    <Field
                      className={cn({
                        [s.input]: true,
                        [s.pr]: true,
                        [s.error]: errors.password && touched.password,
                      })}
                      name="password"
                      type={passShown ? 'text' : 'password'}
                      placeholder={t('password_placeholder')}
                    />
                    {tabletOrHigher && (
                      <Icon
                        className={s.field_icon}
                        name="padlock"
                        width={19}
                        height={19}
                      />
                    )}
                    <div className={s.input_border}></div>
                    <button
                      className={cn({
                        [s.pass_show_btn]: true,
                        [s.shown]: values.password,
                      })}
                      type="button"
                      onClick={() => setPassShown(!passShown)}
                    >
                      <Icon
                        className={s.icon_eye}
                        name={passShown ? 'closed-eye' : 'eye'}
                        width={21}
                        height={21}
                      ></Icon>
                    </button>
                  </div>
                  <ErrorMessage
                    className={s.error_message}
                    name="password"
                    component="span"
                  />
                </div>
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
