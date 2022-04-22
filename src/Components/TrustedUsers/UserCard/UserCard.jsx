import cn from 'classnames'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import ToggleButton from '../../ui/ToggleButton/ToggleButton'
import ControlBtn from '../ControlBtn/ControlBtn'
import { usersOperations } from '../../../Redux'

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
  const { t } = useTranslation('trusted_users')

  const [areControlDotsActive, setAreControlDotsActive] = useState(false)
  const [isSuccessAlertOpened, setIsSuccessAlertOpened] = useState(false)
  const [isStatusAlertOpened, setIsStatusAlertOpened] = useState(false)

  const dispatch = useDispatch()

  const mobile = useMediaQuery({ query: '(max-width: 767px)' })
  const laptopOrHigher = useMediaQuery({ query: '(min-width: 1024px)' })

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
            <p className={s.label}>{t('trusted_users.table_header.email')}:</p>
            <p className={s.user_email}>{email}</p>
          </div>
          <div className={s.name_wrapper}>
            <p className={s.label}>{t('trusted_users.table_header.name')}:</p>
            <p className={s.user_name}>{name}</p>
          </div>
          <div className={s.full_access_wrapper}>
            <p className={s.label}> {t('trusted_users.table_header.full_access')}</p>
            <div className={s.toggle_wrapper}>
              <p className={s.user_access}>
                {hasAccess
                  ? t('trusted_users.user_cards.yes')
                  : t('trusted_users.user_cards.no')}
              </p>
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
            <p className={s.label}>{t('trusted_users.table_header.status')}</p>
            <div className={s.toggle_wrapper}>
              <p
                className={cn({
                  [s.user_status]: true,
                  [s.user_status_off]: status !== 'on',
                })}
              >
                {status === 'on'
                  ? t('trusted_users.user_cards.active')
                  : t('trusted_users.user_cards.inactive')}
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
            userId={userId}
            userName={name}
            handleUserRolesData={handleUserRolesData}
          />
        </div>
      )}

      {!mobile && (
        <div className={s.table_wrapper}>
          <div className={s.table_row}>
            <p className={s.user_email_lg}>{email}</p>
            <p className={s.user_name_lg}>{name}</p>
            <div className={s.toggle_wrapper_lg}>
              <p className={s.user_access_lg}>
                {hasAccess
                  ? t('trusted_users.user_cards.turn_off_field')
                  : t('trusted_users.user_cards.turn_on_field')}
              </p>
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
            <div className={s.toggle_status_wrapper_lg}>
              {laptopOrHigher && (
                <p className={s.user_status_lg}>
                  {status === 'on'
                    ? t('trusted_users.user_cards.active')
                    : t('trusted_users.user_cards.inactive')}
                </p>
              )}
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
              userName={name}
              userId={userId}
              handleUserRolesData={handleUserRolesData}
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
