import classNames from 'classnames'
import React, { useRef } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Delete, Key, Settings } from '../../../images'
import { useOutsideAlerter } from '../../../utils'

import s from './ControlBtn.module.scss'

export default function ControlBtn({ handleControlDotsClick, areControlDotsActive }) {
  const dropDownEl = useRef()
  const mobile = useMediaQuery({ query: '(max-width: 767px)' })

  useOutsideAlerter(dropDownEl, areControlDotsActive, handleControlDotsClick)

  return (
    <div
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
        </button>

        <button className={s.remove_btn}>
          <Delete className={s.icon} />
          <p className={s.delete_text}>Delete</p>
        </button>
      </div>
    </div>
  )
}
