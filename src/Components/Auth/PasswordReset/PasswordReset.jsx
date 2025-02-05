import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { Link, useNavigate } from 'react-router-dom'
import cn from 'classnames'
import * as Yup from 'yup'

import { authOperations } from '@redux'
import * as routes from '@src/routes'
import { Button, Icon } from '@components'
import s from './PasswordReset.module.scss'
import {
  EMAIL_SPECIAL_CHARACTERS_REGEX,
  CYRILLIC_ALPHABET_PROHIBITED,
} from '@src/utils/constants'

export default function PasswordReset() {
  const tabletOrHigher = useMediaQuery({ query: '(min-width: 768px)' })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation('auth')

  const [email, setEmail] = useState('')
  const [isValid, setIsValid] = useState('')
  const [emailSended, setEmailSended] = useState(false)
  const [errorType, setErrorType] = useState('')
  const [errorTime, setErrorTime] = useState('')

  const validationSchema = Yup.string()
    .matches(EMAIL_SPECIAL_CHARACTERS_REGEX, t('warnings.special_characters'))
    .matches(CYRILLIC_ALPHABET_PROHIBITED, t('warnings.cyrillic_prohibited'))
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
      <h3 className={s.form_title}>{t('reset.form_title')}</h3>
      <form className={s.form} onSubmit={handleSubmit}>
        {errorType && (
          <div className={s.credentials_error}>
            {t(`warnings.${errorType}`, { time: errorTime })}
          </div>
        )}

        <p className={s.reset_description}>
          {t('reset.description_1')}
          <a className={s.mail_link} href="mailto:support@zomro.com">
            support@zomro.com
          </a>
          {t('reset.description_2')}
        </p>

        <div className={s.field_wrapper}>
          <label htmlFor="email" className={s.label}>
            {t('email_label')}
          </label>
          <div className={s.input_wrapper}>
            <input
              className={cn({ [s.input]: true, [s.error]: isValid === 'invalid' })}
              name="email"
              type="text"
              placeholder={t('email_placeholder')}
              value={email}
              onChange={handleInputChange}
              onBlur={validateEmail}
            />
            {tabletOrHigher && <Icon name="Envelope" className={s.field_icon} />}
            <div className={s.input_border}></div>
          </div>

          {isValid === 'invalid' && (
            <span className={s.error_message}>{t('warnings.invalid_email')}</span>
          )}
        </div>
        <Button
          className={s.submit_btn}
          type="submit"
          label={t('reset.send_btn')}
          isShadow
        />

        <Link className={s.reset_pass_link} to={routes.LOGIN}>
          {t('reset.cancel_link')}
        </Link>
      </form>
    </div>
  ) : (
    <div className={s.form_wrapper}>
      <h3 className={s.form_title}>{t('reset.confirmation_title')}</h3>
      <form className={s.form}>
        <p className={s.reset_description}>{t('reset.confirm_descr_1', { email })}</p>

        <p className={s.reset_description}>
          {t('reset.confirm_descr_2')}
          <a className={s.mail_link} href="mailto:support@zomro.com">
            support@zomro.com
          </a>
          {t('reset.confirm_descr_3')}
        </p>
        {/* <Link className={s.to_login_link} to={routes.LOGIN}>
          <span className={s.btn_text}>OK</span>
        </Link> */}
        <Button
          className={cn(s.submit_btn, s.mw)}
          label="OK"
          isShadow
          onClick={() => navigate(routes.LOGIN, { replace: true })}
        />
      </form>
    </div>
  )
}
