import React from 'react'
import s from './Button.module.scss'
import PropTypes from 'prop-types'
import cn from 'classnames'

export default function Component(props) {
  const { label, type, onClick, disabled, size, isShadow, className } = props

  return (
    <button
      disabled={disabled}
      className={cn({
        [s.submit_btn]: true,
        [s.shadow]: isShadow,
        [s.block]: size === 'block',
        [s.small]: size === 'small',
        [s.medium]: size === 'medium',
        [s.large]: size === 'large',
        [className]: className,
      })}
      type={type}
      onClick={onClick}
    >
      <span className={s.btn_text}>{label}</span>
    </button>
  )
}

Component.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'reset', 'submit']),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  isShadow: PropTypes.bool,
  size: PropTypes.oneOf(['block', 'small', 'medium', 'large']),
}

Component.defaultProps = {
  label: 'Button',
  type: 'button',
  onClick: () => null,
  disabled: false,
  size: 'block',
  isShadow: false,
}
