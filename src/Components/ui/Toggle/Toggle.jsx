import React, { useState, useEffect } from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'
import s from './Toggle.module.scss'

export default function Component({
  initialState,
  setValue,
  func,
  hasConfirmation,
  disabled,
}) {
  const [isToggled, setIsToggled] = useState(false)

  useEffect(() => {
    setIsToggled(initialState)
  }, [initialState])

  useEffect(() => {
    setValue && setValue(isToggled)
  }, [isToggled])

  const toggleHandler = val => {
    if (!hasConfirmation) {
      func && func()
      setIsToggled(!val)
    } else {
      func()
    }
  }

  return (
    <button
      disabled={disabled}
      className={cn({
        [s.btn]: true,
        [s.active]: isToggled,
        [s.disabled]: disabled,
      })}
      type="button"
      onClick={() => toggleHandler(isToggled)}
    >
      <p className={cn({ [s.circle]: true, [s.active]: isToggled })}></p>
    </button>
  )
}

Component.propTypes = {
  disabled: PropTypes.bool,
  initialState: PropTypes.bool,
  setValue: PropTypes.func,
  func: PropTypes.func,
  hasConfirmation: PropTypes.bool,
}
