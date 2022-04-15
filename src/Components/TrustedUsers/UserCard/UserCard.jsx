import cn from 'classnames'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import PropTypes from 'prop-types'

import ToggleButton from '../../ui/ToggleButton/ToggleButton'
import ControlBtn from '../ControlBtn/ControlBtn'
import { usersOperations } from '../../../Redux/users/usersOperations'

import s from './UserCard.module.scss'

export default function UserCard({
  name,
  hasAccess,
  status,
  email,
  userId,
  handleUserRolesData,
  isOwner,
}) {
  const [areControlDotsActive, setAreControlDotsActive] = useState(false)
  const [isSuccessAlertOpened, setIsSuccessAlertOpened] = useState(false)
  const [isStatusAlertOpened, setIsStatusAlertOpened] = useState(false)

  const dispatch = useDispatch()

  const mobile = useMediaQuery({ query: '(max-width: 767px)' })

  const handleControlDotsClick = () => {
    setAreControlDotsActive(!areControlDotsActive)
  }

  const handleAccessAlert = () => {
    setIsSuccessAlertOpened(!isSuccessAlertOpened)
  }
  const handleStatusAlert = () => {
    setIsStatusAlertOpened(!isStatusAlertOpened)
  }

  const handleAccessClick = () => {
    const switchAccess = hasAccess ? 'off' : 'on'
    setIsSuccessAlertOpened(!isSuccessAlertOpened)
    dispatch(usersOperations.changeUserRights(userId, switchAccess, handleUserRolesData))
  }

  const handleStatusClick = () => {
    const changeStatus = status === 'on' ? 'suspend' : 'resume'
    setIsStatusAlertOpened(!isStatusAlertOpened)
    dispatch(usersOperations.changeUserStatus(userId, changeStatus, handleUserRolesData))
  }

  return (
    <>
      {mobile && (
        <div className={s.min_card_wrapper}>
          <div className={s.email_wrapper}>
            <p className={s.label}>Email:</p>
            <p className={s.user_email}>{email}</p>
          </div>
          <div className={s.name_wrapper}>
            <p className={s.label}>ФИО или название:</p>
            <p className={s.user_name}>{name}</p>
          </div>
          <div className={s.full_access_wrapper}>
            <p className={s.label}>Полный доступ:</p>
            <div className={s.toggle_wrapper}>
              <p className={s.user_access}>{hasAccess ? 'Yes' : 'No'}</p>
              <ToggleButton
                toggleName="access"
                func={handleAccessClick}
                initialState={hasAccess}
                isAlertOpened={isSuccessAlertOpened}
                email={email}
                handleAlert={handleAccessAlert}
                isOwner={isOwner}
              />
            </div>
          </div>
          <div className={s.status_wrapper}>
            <p className={s.label}>Статус:</p>
            <div className={s.toggle_wrapper}>
              <p
                className={cn({
                  [s.user_status]: true,
                  [s.user_status_off]: status !== 'on',
                })}
              >
                {status === 'on' ? 'Active' : 'Inactive'}
              </p>
              <ToggleButton
                toggleName="status"
                initialState={status === 'on'}
                func={handleStatusClick}
                isAlertOpened={isStatusAlertOpened}
                email={email}
                handleAlert={handleStatusAlert}
                isOwner={isOwner}
              />
            </div>
          </div>

          <ControlBtn
            handleControlDotsClick={handleControlDotsClick}
            areControlDotsActive={areControlDotsActive}
            isOwner={isOwner}
          />
        </div>
      )}

      {!mobile && (
        <div className={s.table_wrapper}>
          <div className={s.table_row}>
            <p className={s.user_email_lg}>{email}</p>
            <p className={s.user_name_lg}>{name}</p>
            <div className={s.toggle_wrapper_lg}>
              <p className={s.user_access_lg}>{hasAccess ? 'turn off' : 'turn on'}</p>
              <ToggleButton
                toggleName="access"
                func={handleAccessClick}
                initialState={hasAccess}
                isAlertOpened={isSuccessAlertOpened}
                email={email}
                handleAlert={handleAccessAlert}
                isOwner={isOwner}
              />
            </div>
            <div className={s.toggle_wrapper_lg}>
              <ToggleButton
                toggleName="status"
                initialState={status === 'on'}
                func={handleStatusClick}
                isAlertOpened={isStatusAlertOpened}
                email={email}
                handleAlert={handleStatusAlert}
                isOwner={isOwner}
              />
            </div>

            <ControlBtn
              handleControlDotsClick={handleControlDotsClick}
              areControlDotsActive={areControlDotsActive}
              isOwner={isOwner}
            />
          </div>
        </div>
      )}
    </>
  )
}

UserCard.propTypes = {
  name: PropTypes.string,
  hasAccess: PropTypes.string,
  status: PropTypes.string,
  email: PropTypes.string,
  userId: PropTypes.string,
  handleUserRolesData: PropTypes.func,
  isOwner: PropTypes.bool,
}
