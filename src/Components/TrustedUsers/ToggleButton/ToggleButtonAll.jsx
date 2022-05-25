import React from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'

import s from './ToggleButton.module.scss'

export default function ToggleButtonAll({
  id,
  func,
  initialState,
  isOwner,
  size,
  disabled,
}) {
  return (
    <button
      id={id}
      disabled={isOwner || disabled}
      className={cn({
        [s.btn]: true,
        [s.small_btn]: size === 'small',
        [s.active]: initialState,
        [s.owner]: isOwner || disabled,
      })}
      type="button"
      onClick={() => func()}
    >
      <p
        className={cn({
          [s.circle]: true,
          [s.small_btn]: size === 'small',
          [s.active]: initialState,
        })}
      ></p>
    </button>
  )
}

ToggleButtonAll.propTypes = {
  func: PropTypes.func,
  initialState: PropTypes.any,
  isAlertOpened: PropTypes.bool,
  toggleName: PropTypes.string,
  email: PropTypes.string,
  handleAlert: PropTypes.func,
  hasAlert: PropTypes.bool,
}
