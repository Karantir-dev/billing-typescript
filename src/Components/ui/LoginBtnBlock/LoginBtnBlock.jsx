import React from 'react'

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import * as routes from '../../../routes'
import s from './LoginBtnBlock.module.scss'

export default function Loader({ login = false }) {
  const { t } = useTranslation('auth')

  return (
    <div className={s.auth_links_wrapper}>
      {login ? (
        <>
          <span className={s.current_auth_link}>{t('logIn')}</span>
          <Link className={s.auth_link} to={routes.REGISTRATION}>
            {t('registration')}
          </Link>
        </>
      ) : (
        <>
          <Link className={s.auth_link} to={routes.LOGIN}>
            {t('logIn')}
          </Link>
          <span className={s.current_auth_link}>{t('registration')}</span>
        </>
      )}
    </div>
  )
}
