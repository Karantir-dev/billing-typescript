import cn from 'classnames'
import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import { usersOperations } from '@redux'
import { Delete, Key, Settings } from '@images'
import ManageUserForm from '../ManageUserForm/ManageUserForm'
import { useOutsideAlerter } from '@utils'
import Alert from '../../ui/Alert/Alert'
import { Button } from '../..'

import s from './ControlBtn.module.scss'

export default function ControlBtn({
  handleControlDotsClick,
  areControlDotsActive,
  isOwner,
  userId,
  handleUserRolesData,
  userName,
  handleRightsAlert,
  email,
  hasAccess,
  isDeleteUserAllowedToRender,
  isEditUserAllowedToChange,
  isEditUserAllowed,
  isRightsComponentAllowedToRender,
}) {
  const { t } = useTranslation('trusted_users')
  const [showRemoveAlert, setShowRemoveAlert] = useState(false)

  const [settingsForm, setSettingForm] = useState(false)

  const dropDownEl = useRef()
  const mobile = useMediaQuery({ query: '(max-width: 767px)' })

  useOutsideAlerter(dropDownEl, areControlDotsActive, handleControlDotsClick)

  const dispatch = useDispatch()

  const handleRemoveAlert = () => {
    setShowRemoveAlert(!showRemoveAlert)
  }

  const handleSettingsForm = () => {
    setSettingForm(!settingsForm)
  }

  const handleSubmit = values => {
    // const { email, name, phone, password } = values

    dispatch(
      usersOperations.editUserInfo(
        values['password' + userId],
        values['email' + userId],
        values['phone' + userId],
        values['name' + userId],
        userId,
        handleSettingsForm,
      ),
    )
  }

  const removeUser = () => {
    dispatch(usersOperations.removeUser(userId, handleUserRolesData))
    handleRemoveAlert()
  }

  return (
    <>
      <div
        data-testid="controlBtn_testId"
        role="button"
        tabIndex={0}
        onKeyDown={() => null}
        className={mobile ? s.control_btn : s.control_btn_lg}
        onClick={handleControlDotsClick}
      >
        <span className={s.dot}></span>
        <span className={s.dot}></span>
        <span className={s.dot}></span>

        <div
          data-testid="controlBtn_dropdown_testId"
          role="button"
          tabIndex={0}
          onKeyDown={() => null}
          onClick={e => e.stopPropagation()}
          className={cn({
            [s.list]: true,
            [s.opened]: areControlDotsActive,
          })}
          ref={dropDownEl}
        >
          <button
            disabled={!isEditUserAllowed}
            className={cn({ [s.settings_btn]: true, [s.owner]: !isEditUserAllowed })}
            onClick={handleSettingsForm}
          >
            <Settings className={s.icon} />
            <p className={s.setting_text}>
              {t('trusted_users.user_cards.drop_list.settings')}
            </p>
          </button>

          <button
            disabled={isOwner || hasAccess || !isRightsComponentAllowedToRender}
            className={cn({
              [s.access_rights_btn]: true,
              [s.owner]: isOwner || hasAccess || !isRightsComponentAllowedToRender,
            })}
            onClick={handleRightsAlert}
          >
            <Key className={s.icon} />
            <p className={s.access_text}>
              {t('trusted_users.user_cards.drop_list.access_rights')}
            </p>
          </button>

          <button
            data-testid="show_removing_alert"
            disabled={isOwner || !isDeleteUserAllowedToRender}
            className={cn({
              [s.remove_btn]: true,
              [s.owner]: isOwner || !isDeleteUserAllowedToRender,
            })}
            onClick={handleRemoveAlert}
          >
            <Delete className={s.icon} />
            <p className={s.delete_text}>
              {t('trusted_users.user_cards.drop_list.delete')}
            </p>
          </button>
        </div>
      </div>

      <Alert
        hasControlBtns={true}
        dataTestid="trusted_users_alert_remove"
        isOpened={showRemoveAlert}
        controlAlert={handleRemoveAlert}
        title={t('trusted_users.alerts.remove.title')}
        text={`${t('trusted_users.alerts.remove.text')} ${userName}?`}
        mainBtn={
          <Button
            dataTestid="alert_removeuser_test_status"
            size="small"
            label={t('trusted_users.alerts.remove.btn_text_ok').toUpperCase()}
            type="button"
            className={cn({ [s.remove_btn]: true, [s.btn]: true })}
            onClick={removeUser}
            isShadow
          />
        }
      />

      {settingsForm && (
        <ManageUserForm
          isOpen={settingsForm}
          formName="settings"
          title={t('trusted_users.rights_alert.usrparam')}
          subtitle={email}
          handleSubmit={handleSubmit}
          closeModal={handleSettingsForm}
          dataTestid="settings_form"
          email={email}
          userName={userName}
          isEditUserAllowedToChange={isEditUserAllowedToChange}
          userId={userId}
        />
      )}
    </>
  )
}

ControlBtn.propTypes = {
  handleControlDotsClick: PropTypes.func,
  isOwner: PropTypes.bool,
  areControlDotsActive: PropTypes.bool,
  userId: PropTypes.string,
  handleUserRolesData: PropTypes.func,
  rightsList: PropTypes.array,
  email: PropTypes.string,
  isDeleteUserAllowedToRender: PropTypes.bool,
  isEditUserAllowedToChange: PropTypes.bool,
  isEditUserAllowed: PropTypes.bool,
  isRightsComponentAllowedToRender: PropTypes.bool,
}

ControlBtn.defaultProps = {
  isDeleteUserAllowedToRender: false,
}
