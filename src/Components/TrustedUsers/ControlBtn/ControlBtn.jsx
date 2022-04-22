import cn from 'classnames'
import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import { usersOperations } from '../../../Redux'
import { Delete, Key, Settings } from '../../../images'
import { useOutsideAlerter } from '../../../utils'
import Alert from '../../ui/Alert/Alert'
import AccessRightsAlert from '../AccessRightsAlert/AccessRightsAlert'
import { Button } from '../..'

import s from './ControlBtn.module.scss'
import AccessRights from '../AccessRights/AccessRights'

export default function ControlBtn({
  handleControlDotsClick,
  areControlDotsActive,
  isOwner,
  userId,
  handleUserRolesData,
  userName,
  rightsList,
}) {
  const { t } = useTranslation('trusted_users')

  const [showRemoveAlert, setShowRemoveAlert] = useState(false)
  const [showRightsAlert, setShowRightsAlert] = useState(false)

  const dropDownEl = useRef()
  const mobile = useMediaQuery({ query: '(max-width: 767px)' })

  useOutsideAlerter(dropDownEl, areControlDotsActive, handleControlDotsClick)

  const dispatch = useDispatch()

  const handleRemoveAlert = () => {
    setShowRemoveAlert(!showRemoveAlert)
  }
  const handleRightsAlert = () => {
    setShowRightsAlert(!showRightsAlert)
  }

  const removeUser = () => {
    dispatch(usersOperations.removeUser(userId, handleUserRolesData))
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
          <button className={s.settings_btn}>
            <Settings className={s.icon} />{' '}
            <p className={s.setting_text}>
              {t('trusted_users.user_cards.drop_list.settings')}
            </p>
          </button>
          <button
            disabled={isOwner}
            className={cn({ [s.access_rights_btn]: true, [s.owner]: isOwner })}
            onClick={handleRightsAlert}
          >
            <Key className={s.icon} />
            <p className={s.access_text}>
              {t('trusted_users.user_cards.drop_list.access_rights')}
            </p>
          </button>

          <button
            data-testid="show_removing_alert"
            disabled={isOwner}
            className={cn({ [s.remove_btn]: true, [s.owner]: isOwner })}
            onClick={handleRemoveAlert}
          >
            <Delete className={s.icon} />
            <p className={s.delete_text}>
              {t('trusted_users.user_cards.drop_list.delete')}
            </p>
          </button>
        </div>
      </div>

      {showRemoveAlert && (
        <Alert
          hasControlBtns={true}
          dataTestid="trusted_users_alert_status"
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
              className={s.add_btn}
              onClick={removeUser}
            />
          }
        />
      )}
      {showRightsAlert && (
        <AccessRightsAlert
          dataTestid="trusted_users_rights_alert"
          isOpened={showRightsAlert}
          controlAlert={handleRightsAlert}
          title={mobile ? 'Права доступа' : 'Права доступа доверенного пользователя'}
          list1={<AccessRights items={rightsList.slice(0, 21)} userId={userId} />}
          list2={<AccessRights items={rightsList.slice(21, 38)} userId={userId} />}
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
}
