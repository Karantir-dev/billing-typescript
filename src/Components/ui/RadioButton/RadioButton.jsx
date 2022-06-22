import React from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'
import s from './RadioButton.module.scss'

export default function Component({
  disabled,
  value,
  name,
  label,
  labelClassName,
  selected,
  setFieldValue,
}) {
  const handleRadioChange = () => {
    setFieldValue(name, value)
  }

  return (
    <div
      className={s.radio_container}
      tabIndex={0}
      onKeyUp={() => null}
      role="button"
      onClick={handleRadioChange}
      disabled={disabled}
    >
      <div
        className={cn({
          [s.radio_outer_circle]: true,
          [s.unselected_circle]: value !== selected,
        })}
      >
        <div
          className={cn({
            [s.radio_inner_circle]: true,
            [s.unselected]: value !== selected,
          })}
        />
      </div>
      <p
        className={cn({
          [s.label_text]: true,
          [labelClassName]: labelClassName,
        })}
      >
        {label}
      </p>
    </div>
  )
}

Component.propTypes = {
  disabled: PropTypes.bool,
  value: PropTypes.string.isRequired,
  name: PropTypes.string,
  label: PropTypes.string,
  labelClassName: PropTypes.string,
  selected: PropTypes.string,
  setFieldValue: PropTypes.func.isRequired,
}
