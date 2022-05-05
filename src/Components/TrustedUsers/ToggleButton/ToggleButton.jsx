import React, { useState } from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import s from './ToggleButton.module.scss'
import Alert from '../../ui/Alert/Alert'
import { Button } from '../..'

export default function ToggleButton({
  func,
  initialState,
  isAlertOpened,
  toggleName,
  email,
  handleAlert,
  isOwner,
  hasAlert,
  size,
}) {
  const { t } = useTranslation('trusted_users')

  const [isToggled, setIsToggled] = useState(initialState || false)

  const getUsersResponse = () => {
    func()
    setIsToggled(!isToggled)
  }

  const handleBtnNoAlert = () => {
    func()
    setIsToggled(!isToggled)
  }

  let alertAccessText

  if (!initialState) {
    alertAccessText = `${t('trusted_users.alerts.access.text')} ${email} ${t(
      'trusted_users.alerts.access.text2',
    )}`
  } else {
    alertAccessText = `${t('trusted_users.alerts.access.text3')} ${email} ${t(
      'trusted_users.alerts.access.text4',
    )}`
  }

  const alertStatusText = !initialState
    ? `${t('trusted_users.alerts.status.text')} ${email}?`
    : `${t('trusted_users.alerts.status.text2')} ${email}?`

  return (
    <>
      <button
        disabled={isOwner}
        className={cn({
          [s.btn]: true,
          [s.small_btn]: size === 'small',
          [s.active]: isToggled,
          [s.owner]: isOwner,
        })}
        type="button"
        onClick={hasAlert ? handleAlert : handleBtnNoAlert}
      >
        <p
          className={cn({
            [s.circle]: true,
            [s.small_btn]: size === 'small',
            [s.active]: isToggled,
          })}
        ></p>
      </button>

      {toggleName === 'access' && (
        <Alert
          hasControlBtns={true}
          dataTestid="trusted_users_alert_access"
          isOpened={isAlertOpened}
          controlAlert={handleAlert}
          title={
            initialState
              ? t('trusted_users.alerts.access.title2')
              : t('trusted_users.alerts.access.title')
          }
          text={alertAccessText}
          mainBtn={
            <Button
              dataTestid="alert_controlBtn_test_access"
              size="small"
              label={
                initialState
                  ? t('trusted_users.alerts.access.btn_text_ok2').toUpperCase()
                  : t('trusted_users.alerts.access.btn_text_ok').toUpperCase()
              }
              type="button"
              className={cn({ [s.add_btn]: true, [s.access]: true })}
              onClick={getUsersResponse}
            />
          }
        />
      )}

      {toggleName === 'status' && (
        <Alert
          hasControlBtns={true}
          dataTestid="trusted_users_alert_status"
          isOpened={isAlertOpened}
          controlAlert={handleAlert}
          title={
            initialState
              ? t('trusted_users.alerts.status.title2')
              : t('trusted_users.alerts.status.title')
          }
          text={alertStatusText}
          mainBtn={
            <Button
              dataTestid="alert_controlBtn_test_status"
              size="small"
              label={
                initialState
                  ? t('trusted_users.alerts.status.btn_text_ok2').toUpperCase()
                  : t('trusted_users.alerts.status.btn_text_ok').toUpperCase()
              }
              type="button"
              className={cn({ [s.add_btn]: true, [s.access]: true })}
              onClick={getUsersResponse}
            />
          }
        />
      )}
    </>
  )
}

ToggleButton.propTypes = {
  func: PropTypes.func,
  initialState: PropTypes.any,
  isAlertOpened: PropTypes.bool,
  toggleName: PropTypes.string,
  email: PropTypes.string,
  handleAlert: PropTypes.func,
  hasAlert: PropTypes.bool,
}
