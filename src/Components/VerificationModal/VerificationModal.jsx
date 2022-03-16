import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cn from 'classnames'

import { authSelectors } from '../../Redux/auth/authSelectors'
import { Icon } from '../Icon'

import s from './VerificationModal.module.scss'
import { useTranslation } from 'react-i18next'
import authActions from '../../Redux/auth/authActions'
import authOperations from '../../Redux/auth/authOperations'

export function VerificationModal() {
  const [totp, setTotp] = useState('')
  const [error, setError] = useState(false)

  const formVisibility = useSelector(authSelectors.getTotpFormVisibility)

  const { t } = useTranslation('auth', { keyPrefix: 'verification' })
  const dispatch = useDispatch()

  function handleSubmit(e) {
    e.preventDefault()
    if (!totp) {
      setError(true)
      return
    }
    setTotp('')
    dispatch(authOperations.sendTotp(totp, setError))
  }

  return (
    <div className={cn({ [s.backdrop]: true, [s.shown]: formVisibility === 'shown' })}>
      <div className={s.modalWindow}>
        <h3 className={s.title}>{t('title')}</h3>
        <button
          className={s.closeBtn}
          onClick={() => dispatch(authActions.closeExtraVerifModal())}
          type="button"
        >
          <Icon className={s.icon} name="cross" width={16} height={16} />
        </button>
        <p className={s.text}>{t('text')}</p>
        <form onSubmit={handleSubmit}>
          <label className={s.label} htmlFor="code">
            {t('label')}
          </label>
          <div className={s.input_wrapper}>
            <input
              className={cn({ [s.input]: true, [s.error]: error })}
              id="code"
              type="text"
              value={totp}
              onChange={e => setTotp(e.target.value)}
              placeholder={t('placeholder')}
              autoFocus
            />
            <div className={s.input_border}></div>
          </div>
          {error && <span className={s.error_msg}>{t('error')}</span>}
          <button className={s.btn} type="submit">
            <span className={s.btn_text}>{t('btn')}</span>
          </button>
        </form>
      </div>
    </div>
  )
}
