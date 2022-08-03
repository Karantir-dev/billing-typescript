import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { Button } from '../../'
import { authSelectors, authActions, authOperations } from '../../../Redux'
import { Cross } from '../../../images'

import s from './VerificationModal.module.scss'
import { useTranslation } from 'react-i18next'

export default function VerificationModal({ onClose }) {
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

  const handleBtnCloseClick = () => {
    onClose()
    dispatch(authActions.closeTotpForm())
  }

  return (
    <div className={cn({ [s.backdrop]: true, [s.shown]: formVisibility === 'shown' })}>
      <div className={s.modalWindow}>
        <h3 className={s.title}>{t('form_title')}</h3>
        <button className={s.closeBtn} onClick={handleBtnCloseClick} type="button">
          <Cross className={s.icon} />
        </button>
        <p className={s.text}>{t('text')}</p>

        <form onSubmit={handleSubmit}>
          <label className={s.label} htmlFor="code">
            {t('label')}
          </label>

          <div className={s.input_wrapper}>
            {formVisibility === 'shown' && (
              <input
                className={cn({ [s.input]: true, [s.error]: error })}
                id="code"
                type="text"
                value={totp}
                onChange={e => setTotp(e.target.value)}
                placeholder={t('placeholder')}
                autoFocus
                autoComplete="off"
              />
            )}
            <div className={s.input_border}></div>
          </div>
          {error && <span className={s.error_msg}>{t('error')}</span>}

          <Button className={s.btn} isShadow type="submit" label={t('btn')} />
        </form>
      </div>
    </div>
  )
}

VerificationModal.propTypes = {
  onClose: PropTypes.func.isRequired,
}
VerificationModal.defaultProps = {
  onClose: () => {},
}
