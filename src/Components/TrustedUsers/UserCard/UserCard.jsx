import cn from 'classnames'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import ControlBtn from '../ControlBtn/ControlBtn'
import AccessRights from '../AccessRights/AccessRights'
import AccessRightsAlert from '../AccessRightsAlert/AccessRightsAlert'
import { Info } from '../../../images'
import Alert from '../../ui/Alert/Alert'
import { Button, Toggle } from '../..'
import { selectors, usersOperations, usersSelectors } from '../../../Redux'

import s from './UserCard.module.scss'

export default function UserCard({
  name,
  hasAccess,
  status,
  email,
  userId,
  handleUserRolesData,
  isOwner,
  hasPageOwnerFullAccess,
}) {
  const { t } = useTranslation('trusted_users')
  const darkTheme = useSelector(selectors.getTheme) === 'dark'

  const [areControlDotsActive, setAreControlDotsActive] = useState(false)
  const [isSuccessAlertOpened, setIsSuccessAlertOpened] = useState(false)
  const [isStatusAlertOpened, setIsStatusAlertOpened] = useState(false)
  const [showRightsAlert, setShowRightsAlert] = useState(false)

  const [availableRights, setAvailabelRights] = useState({})
  const [availableEditRights, setAvailableEditRights] = useState([])
  const [rightsToRender, setRightsToRender] = useState([])

  const checkIfHasArr = availableRights?.toolbar?.toolgrp

  const isTurnOnUserAllowed = Array.isArray(checkIfHasArr)
    ? availableRights?.toolbar?.toolgrp[0]?.toolbtn?.some(el => el?.$name === 'resume')
    : false
  const isTurnOffUserAllowed = Array.isArray(checkIfHasArr)
    ? availableRights?.toolbar?.toolgrp[0]?.toolbtn?.some(el => el?.$name === 'suspend')
    : false
  const isDeleteUserAllowedToRender = Array.isArray(checkIfHasArr)
    ? availableRights?.toolbar?.toolgrp[0]?.toolbtn?.some(el => el?.$name === 'delete')
    : false

  const isEditUserAllowed = Array.isArray(checkIfHasArr)
    ? availableRights?.toolbar?.toolgrp[0]?.toolbtn?.some(el => el?.$name === 'edit')
    : false

  const isEditUserAllowedToChange = availableEditRights?.form?.buttons?.button?.some(
    button => button.$name === 'ok',
  )

  const hasAccessToResumeRights = rightsToRender?.toolbar?.toolgrp
    ?.find(el => {
      return el.$name === 'resume'
    })
    ?.toolbtn?.some(func => {
      return func.$name === 'resume'
    })

  const hasAccessToSuspendRights = rightsToRender?.toolbar?.toolgrp
    ?.find(el => {
      return el.$name === 'resume'
    })
    ?.toolbtn?.some(func => {
      return func.$name === 'suspend'
    })

  const hasAccessToSuspendRightsOnly = rightsToRender?.toolbar?.toolgrp?.some(el => {
    return el.$name === 'suspend'
  })

  const isRightsComponentAllowedToRender = Array.isArray(checkIfHasArr)
    ? availableRights?.toolbar?.toolgrp?.some(el => el?.$name === 'rights')
    : false

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

    dispatch(usersOperations.changeUserRights(userId, switchAccess, handleUserRolesData))

    if (switchAccess === 'off') {
      dispatch(usersOperations.getRights(userId, isOwner))
    }
    setIsSuccessAlertOpened(!isSuccessAlertOpened)
  }

  const handleStatusClick = () => {
    const changeStatus = status === 'on' ? 'suspend' : 'resume'
    setIsStatusAlertOpened(!isStatusAlertOpened)
    dispatch(usersOperations.changeUserStatus(userId, changeStatus, handleUserRolesData))
  }

  useEffect(() => {
    if (!isOwner && !hasAccess) {
      dispatch(usersOperations.getRights(userId, isOwner))
    }
  }, [showRightsAlert])

  useEffect(() => {
    dispatch(usersOperations.getAvailableRights('user', setAvailabelRights))
  }, [])

  useEffect(() => {
    if (isEditUserAllowed) {
      dispatch(usersOperations.getAvailableRights('user.edit', setAvailableEditRights))
    }
  }, [isEditUserAllowed])

  useEffect(() => {
    if (!isOwner && !hasAccess) {
      dispatch(usersOperations.getRights(userId, isOwner, setRightsToRender))
    }
  }, [isRightsComponentAllowedToRender])

  // new toggle

  let alertAccessText = ''

  if (!hasAccess) {
    alertAccessText = `${t('trusted_users.alerts.access.text')} ${email} ${t(
      'trusted_users.alerts.access.text2',
    )}`
  } else {
    alertAccessText = `${t('trusted_users.alerts.access.text3')} ${email} ${t(
      'trusted_users.alerts.access.text4',
    )}`
  }

  const alertStatusText =
    !status === 'on'
      ? `${t('trusted_users.alerts.status.text')} ${email}?`
      : `${t('trusted_users.alerts.status.text2')} ${email}?`

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

              <Toggle
                initialState={hasAccess === 'on'}
                func={handleAccessAlert}
                disabled={!hasPageOwnerFullAccess || isOwner}
                hasConfirmation
              />

              {hasAccess && !isOwner && (
                <div
                  className={s.warning_sign_wrapper}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >
                  <Info className={s.warning_sign} />
                  <p
                    className={cn({
                      [s.warning_text]: true,
                      [s.mobile]: mobile,
                      [s.light]: !darkTheme,
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

              <Toggle
                initialState={status === 'on'}
                func={handleStatusAlert}
                disabled={
                  (!isTurnOnUserAllowed && status === 'off') ||
                  (!isTurnOffUserAllowed && status === 'on') ||
                  isOwner
                }
                hasConfirmation
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
            isDeleteUserAllowedToRender={isDeleteUserAllowedToRender}
            isEditUserAllowedToChange={isEditUserAllowedToChange}
            isEditUserAllowed={isEditUserAllowed}
            isRightsComponentAllowedToRender={isRightsComponentAllowedToRender}
          />
        </div>
      )}

      {!mobile && (
        <div className={s.table_wrapper}>
          <div className={s.table_row}>
            <p className={s.user_email_lg}>{email}</p>
            <p className={s.user_name_lg}>{name}</p>
            <div className={s.toggle_wrapper_lg}>
              {laptopOrHigher && (
                <p className={s.user_access_lg}>
                  {hasAccess
                    ? t('trusted_users.user_cards.turn_off_field')
                    : t('trusted_users.user_cards.turn_on_field')}
                </p>
              )}

              <Toggle
                initialState={hasAccess === 'on'}
                func={handleAccessAlert}
                disabled={!hasPageOwnerFullAccess || isOwner}
                hasConfirmation
              />

              {hasAccess && !isOwner && (
                <div
                  className={s.warning_sign_wrapper}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >
                  <Info className={s.warning_sign} />
                  <p
                    className={cn({
                      [s.warning_text]: true,
                      [s.light]: !darkTheme,
                      [s.hovered]: hovered,
                    })}
                  >
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
              <Toggle
                initialState={status === 'on'}
                func={handleStatusAlert}
                disabled={
                  (!isTurnOnUserAllowed && status === 'off') ||
                  (!isTurnOffUserAllowed && status === 'on') ||
                  isOwner
                }
                hasConfirmation
              />
            </div>
            <div className={s.control_btn}>
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
                isDeleteUserAllowedToRender={isDeleteUserAllowedToRender}
                isEditUserAllowedToChange={isEditUserAllowedToChange}
                isEditUserAllowed={isEditUserAllowed}
                isRightsComponentAllowedToRender={isRightsComponentAllowedToRender}
              />
            </div>
          </div>
        </div>
      )}

      {isSuccessAlertOpened && (
        <Alert
          hasControlBtns={true}
          dataTestid="trusted_users_alert_access"
          isOpened={isSuccessAlertOpened}
          controlAlert={handleAccessAlert}
          title={
            hasAccess
              ? t('trusted_users.alerts.access.title2')
              : t('trusted_users.alerts.access.title')
          }
          text={alertAccessText}
          mainBtn={
            <Button
              dataTestid="alert_controlBtn_test_access"
              size="small"
              label={
                hasAccess
                  ? t('trusted_users.alerts.access.btn_text_ok2').toUpperCase()
                  : t('trusted_users.alerts.access.btn_text_ok').toUpperCase()
              }
              type="button"
              className={cn({ [s.add_btn]: true, [s.access]: true })}
              onClick={handleAccessClick}
              isShadow
            />
          }
        />
      )}

      {isStatusAlertOpened && (
        <Alert
          hasControlBtns={true}
          dataTestid="trusted_users_alert_status"
          isOpened={isStatusAlertOpened}
          controlAlert={handleStatusAlert}
          title={
            status === 'on'
              ? t('trusted_users.alerts.status.title2')
              : t('trusted_users.alerts.status.title')
          }
          text={alertStatusText}
          mainBtn={
            <Button
              dataTestid="alert_controlBtn_test_status"
              size="small"
              label={
                status === 'on'
                  ? t('trusted_users.alerts.status.btn_text_ok2').toUpperCase()
                  : t('trusted_users.alerts.status.btn_text_ok').toUpperCase()
              }
              type="button"
              className={cn({ [s.add_btn]: true, [s.access]: true })}
              onClick={handleStatusClick}
              isShadow
            />
          }
        />
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
          list1={
            <AccessRights
              hasAccessToSuspendRightsOnly={hasAccessToSuspendRightsOnly}
              hasAccessToSuspendRights={hasAccessToSuspendRights}
              hasAccessToResumeRights={hasAccessToResumeRights}
              items={listWithoutProfile.slice(0, 20)}
              userId={userId}
            />
          }
          list2={
            <AccessRights
              hasAccessToSuspendRightsOnly={hasAccessToSuspendRightsOnly}
              hasAccessToSuspendRights={hasAccessToSuspendRights}
              hasAccessToResumeRights={hasAccessToResumeRights}
              items={listWithoutProfile.slice(20, 38)}
              userId={userId}
            />
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
  hasPageOwnerFullAccess: PropTypes.bool,
}
