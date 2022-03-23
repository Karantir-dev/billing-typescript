import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import * as Yup from 'yup'

import { Link } from 'react-router-dom'

import * as routes from '../../routes'
import { Icon } from '../Icon'
import s from './SignupForm.module.scss'

export function SignupForm() {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('warnings.name_required')),
    email: Yup.string()
      .email(t('warnings.invalid_email'))
      .required(t('warnings.email_required')),
    password: Yup.string().required(t('warnings.password_required')),
    passConfirmation: Yup.string()
      .oneOf([Yup.ref('password')], t('warnings.mismatched_password'))
      .required(t('warnings.mismatched_password')),
    reCaptcha: Yup.string()
      .typeError(t('warnings.recaptcha'))
      .required(t('warnings.recaptcha')),
  })

  return (
    <div className={s.form_wrapper}>
      <div className={s.auth_links_wrapper}>
        <span className={s.current_auth_link}>{t('registration')}</span>
        <Link className={s.auth_link} to={routes.REGISTRATION}>
          {t('logIn')}
        </Link>
      </div>

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
