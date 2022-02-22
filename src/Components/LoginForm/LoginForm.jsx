import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import ReCAPTCHA from 'react-google-recaptcha'

import authOperations from '../../Redux/auth/authOperations'
import { Icon } from '../Icon'
import * as routes from '../../routes'

import s from './LoginForm.module.scss'

export function LoginForm() {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const handleSubmit = ({ email, password, reCaptcha }) => {
    dispatch(authOperations.login(email, password, reCaptcha))
  }

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
        {({ setFieldValue }) => {
          return (
            <Form className={s.form}>
              <div className={s.input_wrapper}>
                <label htmlFor="email" className={s.label}>
                  {t('email_label')}
                </label>
                <Field
                  className={s.input}
                  name="email"
                  type="text"
                  placeholder={t('email_placeholder')}
                />
                <ErrorMessage className={s.error_message} name="email" component="span" />
              </div>

              <div className={s.input_wrapper}>
                <label htmlFor="password" className={s.label}>
                  {t('password_label')}
                </label>
                <Field
                  className={s.input}
                  name="password"
                  type="password"
                  placeholder={t('password_placeholder')}
                />
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
                  console.log(value)
                  setFieldValue('reCaptcha', value)
                }}
                onErrored={() => {
                  console.log('error')
                }}
                theme="light"
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

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Введите валидный email').required('Введите email'),
  password: Yup.string().required('Введите пароль'),
  reCaptcha: Yup.string()
    .typeError('Подтвердите что вы человек')
    .required('Подтвердите что вы человек'),
})
