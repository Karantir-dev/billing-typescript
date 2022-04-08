import classNames from 'classnames'
import React, { useRef, useState } from 'react'
import { Delete, Key, Settings } from '../../../images'
import { useOutsideAlerter } from '../../../utils'
import ToggleButton from '../../ui/ToggleButton/ToggleButton'
// import { Button } from '..'

import s from './UserCard.module.scss'

export default function UserCard({ name, hasAccess, status, email }) {
  const [areControlDotsActive, setAreControlDotsActive] = useState(false)

  const dropDownEl = useRef()

  const handleControlDotsClick = () => {
    setAreControlDotsActive(!areControlDotsActive)
  }

  useOutsideAlerter(dropDownEl, areControlDotsActive, handleControlDotsClick)

  return (
    <>
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
          <p className={s.user_access}>{hasAccess ? 'Yes' : 'No'}</p>
        </div>
        <div className={s.status_wrapper}>
          <p className={s.label}>Статус:</p>
          <p
            className={classNames({
              [s.user_status]: true,
              [s.user_status_off]: status !== 'on',
            })}
          >
            {status === 'on' ? 'Active' : 'Inactive'}
          </p>
        </div>

        <button
          className={classNames({
            [s.control_btn]: true,
          })}
          onClick={handleControlDotsClick}
        >
          <span className={s.dot}></span>
          <span className={s.dot}></span>
          <span className={s.dot}></span>

          <div
            role="button"
            tabIndex={0}
            onKeyDown={() => null}
            onClick={e => e.stopPropagation()}
            className={classNames({
              [s.list]: true,
              [s.opened]: areControlDotsActive,
            })}
            ref={dropDownEl}
          >
            <button className={s.settings_btn}>
              <Settings className={s.icon} /> <p className={s.setting_text}>Settings</p>
            </button>
            <button className={s.access_rights_btn}>
              <Key className={s.icon} />
              <p className={s.access_text}>Access rights</p>
              <ToggleButton />
            </button>
            <button className={s.remove_btn}>
              <Delete className={s.icon} />
              <p className={s.delete_text}>Delete</p>
            </button>
          </div>
        </button>
      </div>

      {/* <div className={s.large_card_wrapper}>
        <p className={s.user_email_lg}>{email}</p>
        <p className={s.user_name_lg}>{name}</p>
        <p className={s.user_access_lg}>{hasAccess ? 'Yes' : 'No'}</p>
        <p className={s.label}>Статус:</p>
        <p
          className={classNames({
            [s.user_status]: true,
            [s.user_status_off]: status !== 'on',
          })}
        >
          Статус
        </p>
      </div> */}
    </>
  )
}
