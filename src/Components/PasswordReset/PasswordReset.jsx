import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { Link } from 'react-router-dom'
import { Icon } from '../Icon'

import { authOperations } from '../../Redux/auth/authOperations'
import * as Yup from 'yup'
import * as routes from '../../routes'
import cn from 'classnames'
import s from './PasswordReset.module.scss'

export function PasswordReset() {
  const tabletOrHigher = useMediaQuery({ query: '(min-width: 768px)' })
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const [email, setEmail] = useState('')
  const [isValid, setIsValid] = useState('')
  const [emailSended, setEmailSended] = useState(false)
  const [errorType, setErrorType] = useState('')
  const [errorTime, setErrorTime] = useState('')

  const validationSchema = Yup.string()
    .email(t('warnings.invalid_email'))
    .required(t('warnings.email'))

  const handleInputChange = event => {
    setEmail(event.target.value)
    setErrorType('')
    setErrorTime('')
  }

  const validateEmail = async () => {
    const valid = await validationSchema.isValid(email)
    setIsValid(valid ? 'valid' : 'invalid')
    return valid
  }

  const handleSubmit = event => {
    event.preventDefault()

    validateEmail().then(valid => {
      valid &&
        dispatch(authOperations.reset(email, setEmailSended, setErrorType, setErrorTime))
    })
  }

  return !emailSended ? (
    <div className={s.form_wrapper}>
      <h3 className={s.form_title}>{t('reset.resetTitle')}</h3>
      <form className={s.form} onSubmit={handleSubmit}>
        {errorType && (
          <div className={s.credentials_error}>
            {t(`warnings.${errorType}`, { time: errorTime })}
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
            <input
              className={cn({ [s.input]: true, [s.error]: isValid === 'invalid' })}
              name="email"
              type="text"
              placeholder={t('reset.resetEmail')}
              value={email}
              onChange={handleInputChange}
              onBlur={validateEmail}
            />
            {tabletOrHigher && (
              <Icon className={s.field_icon} name="envelope" width={19} height={15} />
            )}
            <div className={s.input_border}></div>
          </div>

          {isValid === 'invalid' && (
            <span className={s.error_message}>{t('warnings.invalid_email')}</span>
          )}
        </div>
        <button className={s.submit_btn} type="submit">
          <span className={s.btn_text}>{t('reset.resetButton')}</span>
        </button>
        <Link className={s.reset_pass_link} to={routes.LOGIN}>
          {t('reset.resetCancel')}
        </Link>
      </form>
    </div>
  ) : (
    <div className={s.form_wrapper}>
      <h3 className={s.form_title}>{t('reset.confirmTitle')}</h3>
      <form className={s.form}>
        <p className={s.reset_description}>
          {t('reset.confirmDescription_1')}
          <span>{email}</span>
          {t('reset.confirmDescription_2')}
        </p>

        <p className={s.reset_description}>
          {t('reset.confirmDescription_3')}
          <a className={s.mail_link} href="mailto:support@zomro.com">
            support@zomro.com
          </a>
          {t('reset.confirmDescription_4')}
        </p>
        <Link className={s.to_login_link} to={routes.LOGIN}>
          <span className={s.btn_text}>OK</span>
        </Link>
      </form>
    </div>
  )
}
