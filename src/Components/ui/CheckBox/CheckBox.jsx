import React from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { Check } from '../../../images'
import s from './CheckBox.module.scss'

export default function Component({
  value,
  onClick,
  disabled,
  className,
  error,
  touched,
  name,
}) {
  return (
    <button
      disabled={disabled}
      className={cn({
        [s.btn]: true,
        [s.error]: touched && error,
        [s.active]: value,
        [s.disabled]: disabled,
        [className]: className,
      })}
      type="button"
      name={name || ''}
      onClick={onClick}
    >
      <Check className={cn(s.check, { [s.active]: value })} />
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
  name: PropTypes.string,
}
