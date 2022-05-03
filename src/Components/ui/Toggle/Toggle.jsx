import React, { useState, useEffect } from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'
import s from './Toggle.module.scss'

export default function Component({ initialState, setValue, disabled }) {
  const [isToggled, setIsToggled] = useState(initialState || false)

  useEffect(() => {
    setIsToggled(initialState)
  }, [initialState])

  const toggleHandler = val => {
    setIsToggled(!val)
    setValue && setValue(!val)
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
}
