import React, { useState } from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'

import s from './ToggleButton.module.scss'
import Alert from '../../TrustedUsers/Alert/Alert'
import { Button } from '../..'

export default function ToggleButton({
  func,
  initialState,
  isAlertOpened,
  toggleName,
  email,
  handleAlert,
  isOwner,
}) {
  const [isToggled, setIsToggled] = useState(initialState || false)

  const getUsersResponse = () => {
    func()
    setIsToggled(!isToggled)
  }

  return (
    <>
      <button
        disabled={isOwner}
        className={cn({
          [s.btn]: true,
          [s.active]: isToggled,
          [s.owner]: isOwner,
        })}
        type="button"
        onClick={handleAlert}
      >
        <p className={cn({ [s.circle]: true, [s.active]: isToggled })}></p>
      </button>

      {toggleName === 'access' && (
        <Alert
          dataTestid="trusted_users_alert_access"
          isOpened={isAlertOpened}
          controlAlert={handleAlert}
          title={initialState ? 'Запрет' : 'Включение'}
          text={`После того, как вы включите доступ, ${email} получит доступ в ваш личный кабинет.`}
          mainBtn={
            <Button
              dataTestid="alert_controlBtn_test_access"
              size="small"
              label={initialState ? 'Закрыть'.toUpperCase() : 'Включить'.toUpperCase()}
              type="button"
              className={s.add_btn}
              onClick={getUsersResponse}
            />
          }
        />
      )}

      {toggleName === 'status' && (
        <Alert
          dataTestid="trusted_users_alert_status"
          isOpened={isAlertOpened}
          controlAlert={handleAlert}
          title={initialState ? 'Деактивация статуса' : 'Активация статуса'}
          text={`Вы действительно хотите активировать пользователя ${email}?`}
          mainBtn={
            <Button
              dataTestid="alert_controlBtn_test_status"
              size="small"
              label={
                initialState
                  ? 'Деактивировать'.toUpperCase()
                  : 'Активировать'.toUpperCase()
              }
              type="button"
              className={s.add_btn}
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
}
