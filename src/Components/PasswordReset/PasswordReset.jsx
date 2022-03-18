import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { Link } from 'react-router-dom'
import { Icon } from '../Icon'

import authOperations from '../../Redux/auth/authOperations'
import * as Yup from 'yup'
import * as routes from '../../routes'
import cn from 'classnames'
import s from './PasswordReset.module.scss'

export function PasswordReset() {
  const tabletOrHigher = useMediaQuery({ query: '(min-width: 768px)' })
  const dispatch = useDispatch()

  const { t, i18n } = useTranslation()
  let lang = i18n.language

  const [email, setEmail] = useState('')
  const [confirmEmail, setConfirmEmail] = useState(true)
  const [valid, setValid] = useState('')
  const [emailError, _setEmailError] = useState('')
  const [timeSendError, setTimeSendError] = useState('')
  const [typeEmailError, setTypeEmailError] = useState('')

  const validationSchema = Yup.object().shape({
    email: Yup.string().email(t('warnings.invalid_email')).required(t('warnings.email')),
  })

  const handleInput = event => {
    const email = event.target.value
    setEmail(email)
    setTimeSendError('')
    setTypeEmailError('')
  }

  const validEmail = async () => {
    const isValid = await validationSchema.isValid({ email })
    const stateEmail = isValid ? 'valid' : 'invalid'
    setValid(stateEmail)
    return stateEmail
  }

  const handleSubmit = event => {
    event.preventDefault()

    if (valid === 'valid') {
      dispatch(
        authOperations.reset(
          email,
          lang,
          setConfirmEmail,
          setTimeSendError,
          setTypeEmailError,
        ),
      )
    }
  }

  return (
    (confirmEmail && (
      <div className={s.form_wrapper}>
        <h3 className={s.form_title}>{t('reset.resetTitle')}</h3>
        <form className={s.form} onSubmit={handleSubmit}>
          {typeEmailError && (
            <div className={s.credentials_error}>
              {typeEmailError === 'max_email_send_time'
                ? t('warnings.maxEmailSendError')
                : t('warnings.minEmailSendError', { time: timeSendError })}
            </div>
          )}

          <p className={s.reset_description}>
            {t('reset.restDescription_1')}
            <a className={s.mail_link} href="mailto:support@zomro.com">
              support@zomro.com
            </a>
            {t('reset.restDescription_2')}
          </p>
          <div className={s.field_wrapper}>
            <label htmlFor="email" className={s.label}>
              {t('reset.email')}
            </label>

            <div className={s.input_wrapper}>
              {tabletOrHigher && (
                <Icon className={s.field_icon} name="envelope" width={18} height={14} />
              )}
              <input
                className={cn({ [s.input]: true, [s.error]: valid === 'invalid' })}
                name="email"
                type="text"
                placeholder={t('reset.resetEmail')}
                value={email}
                onChange={handleInput}
                onBlur={validEmail}
              />

              <div className={s.input_border}></div>
            </div>
            {valid === 'invalid' && (
              <span className={s.error_message}>{t('warnings.invalid_email')}</span>
            )}
          </div>
          <button className={s.submit_btn} type="submit" disabled={emailError}>
            <span className={s.btn_text}>{t('reset.resetButton')}</span>
          </button>
          <Link className={s.reset_pass_link} to={routes.LOGIN}>
            {t('reset.resetCancel')}
          </Link>
        </form>
      </div>
    )) || (
      <div className={s.form_wrapper}>
        <h3 className={s.form_title}>{t('reset.confirmTitle')}</h3>
        <form className={s.form}>
          <p className={s.reset_description}>
            {t('reset.confirmDescription_1')}
            <span>{email}</span>
            {t('reset.confirmDescription_2')}
            <br />
            {t('reset.confirmDescription_3')}
            <a className={s.mail_link} href="mailto:support@zomro.com">
              support@zomro.com
            </a>
            {t('reset.confirmDescription_4')}
          </p>
          <Link className={s.submit_btn} to={routes.LOGIN}>
            <span className={s.btn_text}>OK</span>
          </Link>
        </form>
      </div>
    )
  )
}
