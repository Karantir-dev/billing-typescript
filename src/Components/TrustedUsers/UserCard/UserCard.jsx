import cn from 'classnames'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import ToggleButton from '../ToggleButton/ToggleButton'
import ControlBtn from '../ControlBtn/ControlBtn'
import { usersOperations, usersSelectors } from '../../../Redux'

import s from './UserCard.module.scss'
import AccessRights from '../AccessRights/AccessRights'
import AccessRightsAlert from '../AccessRightsAlert/AccessRightsAlert'
import { WanrningSign } from '../../../images'

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
  const [showRightsAlert, setShowRightsAlert] = useState(false)

  const rightsList = useSelector(usersSelectors.getRights)
  const listWithoutProfile = rightsList.filter(item => item.name.$ !== 'clientoption')

  const handleRightsAlert = () => {
    setShowRightsAlert(!showRightsAlert)
  }

  const [hovered, setHovered] = useState(false)

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

  useEffect(() => {
    if (!isOwner) {
      dispatch(usersOperations.getRights(userId, isOwner))
    }
  }, [showRightsAlert])

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
                hasAlert={true}
              />

              {hasAccess && !isOwner && (
                <div
                  className={s.warning_sign_wrapper}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >
                  <WanrningSign className={s.warning_sign} />
                  <p
                    className={cn({
                      [s.warning_text]: true,
                      [s.mobile]: mobile,
                      [s.hovered]: hovered,
                    })}
                  >
                    {t('trusted_users.user_cards.warning_message')}
                  </p>
                </div>
              )}
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
                hasAlert={true}
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
            rightsList={rightsList}
            email={email}
            handleRightsAlert={handleRightsAlert}
            hasAccess={hasAccess}
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
                hasAlert={true}
              />

              {hasAccess && !isOwner && (
                <div
                  className={s.warning_sign_wrapper}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >
                  <WanrningSign className={s.warning_sign} />
                  <p className={cn({ [s.warning_text]: true, [s.hovered]: hovered })}>
                    {t('trusted_users.user_cards.warning_message')}
                  </p>
                </div>
              )}
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
                hasAlert={true}
                handleRightsAlert={handleRightsAlert}
              />
            </div>

            <ControlBtn
              handleControlDotsClick={handleControlDotsClick}
              areControlDotsActive={areControlDotsActive}
              isOwner={isOwner}
              userName={name}
              userId={userId}
              handleUserRolesData={handleUserRolesData}
              handleRightsAlert={handleRightsAlert}
              rightsList={rightsList}
              email={email}
              hasAccess={hasAccess}
            />
          </div>
        </div>
      )}

      {showRightsAlert && (
        <AccessRightsAlert
          dataTestid="trusted_users_rights_alert"
          isOpened={showRightsAlert}
          controlAlert={handleRightsAlert}
          title={
            mobile
              ? t('trusted_users.rights_alert.title_short')
              : t('trusted_users.rights_alert.title_long')
          }
          list1={<AccessRights items={listWithoutProfile.slice(0, 20)} userId={userId} />}
          list2={
            <AccessRights items={listWithoutProfile.slice(20, 38)} userId={userId} />
          }
        />
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
