import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import ReCAPTCHA from 'react-google-recaptcha'
import cn from 'classnames'

import authOperations from '../../Redux/auth/authOperations'
import { Icon } from '../Icon'
import * as routes from '../../routes'

import s from './LoginForm.module.scss'

export function LoginForm() {
  const [passShown, setPassShown] = useState(false)

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const handleSubmit = ({ email, password, reCaptcha }) => {
    dispatch(authOperations.login(email, password, reCaptcha))
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string().email(t('warnings.wrong_email')).required(t('warnings.email')),
    password: Yup.string().required(t('warnings.password')),
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
        {({ setFieldValue, errors }) => {
          return (
            <Form className={s.form}>
              <div className={s.field_wrapper}>
                <label htmlFor="email" className={s.label}>
                  {t('email_label')}
                </label>
                <div className={s.input_wrapper}>
                  {/* <Icon className={s.field_icon} name="envelope" /> */}
                  <Field
                    className={cn({ [s.input]: true, [s.error]: errors.email })}
                    name="email"
                    type="text"
                    placeholder={t('email_placeholder')}
                  />
                  <div className={s.input_border}></div>
                </div>
                <ErrorMessage className={s.error_message} name="email" component="span" />
              </div>

              <div className={s.field_wrapper}>
                <label htmlFor="password" className={s.label}>
                  {t('password_label')}
                </label>
                <div className={s.input_wrapper}>
                  {/* <Icon className={s.field_icon} name="padlock" /> */}
                  <Field
                    className={cn({ [s.input]: true, [s.error]: errors.password })}
                    name="password"
                    type="password"
                    placeholder={t('password_placeholder')}
                  />
                  <div className={s.input_border}></div>
                  <button className="" type="button" onClick={() => setPassShown(true)}>
                    <Icon name={passShown ? 'closed-eye' : 'eye'}></Icon>
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
                onErrored={() => {
                  console.log('ReCAPTCHA error')
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
  )
}
