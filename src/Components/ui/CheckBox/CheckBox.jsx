import React, { useState, useEffect } from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { Check } from '../../../images'
import s from './CheckBox.module.scss'

export default function Component({
  initialState,
  setValue,
  disabled,
  className,
  error,
  touched,
  func,
}) {
  const [isChecked, setIsChecked] = useState(false)

  useEffect(() => {
    setIsChecked(initialState)
  }, [initialState])

  useEffect(() => {
    setValue && setValue(isChecked)
  }, [isChecked])

  const toggleHandler = val => {
    setIsChecked(!val)
    func && func(isChecked)
  }

  return (
    <button
      disabled={disabled}
      className={cn({
        [s.btn]: true,
        [s.error]: touched && error,
        [s.active]: isChecked,
        [s.disabled]: disabled,
        [className]: className,
      })}
      type="button"
      onClick={() => toggleHandler(isChecked)}
    >
      <Check className={cn(s.check, { [s.active]: isChecked })} />
    </button>
  )
}

Component.propTypes = {
  disabled: PropTypes.bool,
  initialState: PropTypes.bool,
  error: PropTypes.bool,
  setValue: PropTypes.func,
  className: PropTypes.string,
  func: PropTypes.func,
}
