import cn from 'classnames'
import PropTypes from 'prop-types'
import { Icon } from '@components'
import s from './CheckBox.module.scss'

export default function Component({
  value,
  onClick,
  disabled,
  className,
  error,
  touched,
  name,
  type = 'checkbox',
  id,
}) {
  return (
    <button
      disabled={disabled}
      className={cn({
        [s.btn]: type === 'checkbox',
        [s.error]: touched && error,
        [s.active]: value,
        [s.disabled]: disabled,
        [className]: className,
      })}
      type="button"
      name={name || ''}
      onClick={onClick}
      id={id}
    >
      {type === 'radio' ? (
        <div
          className={cn(s.radio, {
            [s.active]: value,
          })}
        >
          <span className={cn(s.circle, { [s.active]: value })}></span>
        </div>
      ) : (
        <Icon name="Check" className={cn(s.check, { [s.active]: value })} />
      )}
    </button>
  )
}

Component.propTypes = {
  disabled: PropTypes.bool,
  value: PropTypes.bool,
  error: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  name: PropTypes.string,
  type: PropTypes.string,
  id: PropTypes.string,
}
