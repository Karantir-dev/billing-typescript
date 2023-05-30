import React from 'react'

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import s from './TryLimit.module.scss'
import * as routes from '../../../routes'

export default function Component() {
  const { t } = useTranslation(['user_settings', 'other'])
  const navigate = useNavigate()

  const techSupportNavigateHandler = () => {
    navigate(routes.SUPPORT)
  }

  return (
    <div className={s.tryLimitBlock}>
      <span>
        {t('You have exceeded the number of allowed phone verification attempts.')}
      </span>
      <br />
      <span>
        {t('Contact')}{' '}
        <button onClick={techSupportNavigateHandler} type="button">
          {t('the Technical support')}
        </button>{' '}
        {t('for verification')}
      </span>
    </div>
  )
}
