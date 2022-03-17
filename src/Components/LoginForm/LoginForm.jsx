import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import ReCAPTCHA from 'react-google-recaptcha'
import cn from 'classnames'

import authOperations from '../../Redux/auth/authOperations'
import { useMediaQuery } from 'react-responsive'
import { VerificationModal } from '../VerificationModal/VerificationModal'
import { Icon } from '../Icon'
import * as routes from '../../routes'

import s from './LoginForm.module.scss'

export function LoginForm() {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [passShown, setPassShown] = useState(false)
  const [loginError, setLoginError] = useState(false)

  const tabletOrHigher = useMediaQuery({ query: '(min-width: 768px)' })

  const handleSubmit = ({ email, password, reCaptcha }) => {
    dispatch(authOperations.login(email, password, reCaptcha, setLoginError))
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string().email(t('warnings.invalid_email')).required(t('warnings.email')),
    password: Yup.string().required(t('warnings.password')),
    reCaptcha: Yup.string()
      .typeError(t('warnings.recaptcha'))
      .required(t('warnings.recaptcha')),
  })

  return (
    <>
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
          {({ setFieldValue, errors, values: { password }, touched }) => {
            return (
              <Form className={s.form}>
                {loginError && (
                  <div className={s.credentials_error}>
                    {t('warnings.wrong_credentials')}
                  </div>
                )}
                <div className={s.field_wrapper}>
                  <label htmlFor="email" className={s.label}>
                    {t('email_label')}
                  </label>
                  <div className={s.input_wrapper}>
                    {tabletOrHigher && (
                      <Icon
                        className={s.field_icon}
                        name="envelope"
                        width={19}
                        height={15}
                      />
                    )}
                    <Field
                      className={cn({
                        [s.input]: true,
                        [s.error]: errors.email && touched.email,
                      })}
                      name="email"
                      type="text"
                      placeholder={t('email_placeholder')}
                    />
                    <div className={s.input_border}></div>
                  </div>
                  <ErrorMessage
                    className={s.error_message}
                    name="email"
                    component="span"
                  />
                </div>

                <div className={s.field_wrapper}>
                  <label htmlFor="password" className={s.label}>
                    {t('password_label')}
                  </label>
                  <div className={s.input_wrapper}>
                    {tabletOrHigher && (
                      <Icon
                        className={s.field_icon}
                        name="padlock"
                        width={19}
                        height={19}
                      />
                    )}

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
                    <div className={s.input_border}></div>
                    <button
                      className={cn({ [s.pass_show_btn]: true, [s.shown]: password })}
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

                <ReCAPTCHA
                  className={s.captcha}
                  sitekey="6LdIo4QeAAAAAGaR3p4-0xh6dEI75Y4cISXx3FGR"
                  onChange={value => {
                    setFieldValue('reCaptcha', value)
                  }}
                />

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

      {ReactDOM.createPortal(<VerificationModal />, document.getElementById('portal'))}
    </>
  )
}
