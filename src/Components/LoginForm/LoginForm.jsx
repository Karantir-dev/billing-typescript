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
import { AuthPage } from '../../Pages/AuthPage'

import s from './LoginForm.module.scss'

function LoginForm() {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const handleSubmit = ({ email, password }) => {
    dispatch(authOperations.login(email, password))
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
        initialValues={{ email: '', password: '' }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <Form className={s.form}>
          <div className={s.input_wrapper}>
            <label htmlFor="email" className={s.label}>
              Email Adress:
            </label>
            <Field
              className={s.input}
              name="email"
              type="email"
              placeholder="Enter email"
            />
            <ErrorMessage name="email" />
          </div>

          <div className={s.input_wrapper}>
            <label htmlFor="password" className={s.label}>
              Password:
            </label>
            <Field
              className={s.input}
              name="password"
              type="password"
              placeholder="Enter your password"
            />
            <ErrorMessage name="password" />
          </div>
          <ReCAPTCHA
            className={s.captcha}
            sitekey="6LdIo4QeAAAAAGaR3p4-0xh6dEI75Y4cISXx3FGR"
            onChange={() => {
              console.log('change')
            }}
            onErrored={() => {
              console.log('error')
            }}
            theme="light"
          />

          <button className={s.submit_btn} type="submit">
            <span className={s.btn_text}>LOG IN</span>
          </button>
          <Link className={s.reset_pass_link} to={routes.RESET_PASSWORD}>
            Forgot password?
          </Link>
        </Form>
      </Formik>

      <div>
        <p className={s.social_title}> LOG IN WITH:</p>
        <ul className={s.social_list}>
          <li>
            <Icon name="facebook" size={32}></Icon>
          </li>
          <li>
            <Icon name="google" size={32}></Icon>
          </li>
          <li>
            <Icon name="vk" size={32}></Icon>
          </li>
        </ul>
      </div>
    </div>
  )
}

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Введите валидный email').required('Введите email'),
  password: Yup.string().required('Введите пароль'),
})

export default (
  <AuthPage>
    <LoginForm />
  </AuthPage>
)
