import React, { useState } from 'react'
import { ErrorMessage, Field } from 'formik'
import { useMediaQuery } from 'react-responsive'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { EyeClosed, Eye, Envelope, Padlock, Search, Person } from '../../../images'
import s from './InputField.module.scss'

export default function Component(props) {
  const {
    label,
    iconRight, // icon type
    iconLeft, // icon type
    error,
    touched,
    type,
    placeholder,
    name,
    isShadow, // shadow or border
    className,
    autoComplete,
    height,
    background, // input bgc
    dataTestid,
    disabled,
  } = props

  const tabletOrHigher = useMediaQuery({ query: '(min-width: 768px)' })
  const [passShown, setPassShown] = useState(false)

  const renderIcon = (name, position) => {
    const pos = position === 'left' ? s.field_icon_left : s.field_icon_right
    switch (name) {
      case 'envelope':
        return <Envelope className={pos} />
      case 'padlock':
        return <Padlock className={pos} />
      case 'search':
        return <Search className={pos} />
      case 'person':
        return <Person className={pos} />
      default:
        return null
    }
  }

  const renderPasswordShown = type => {
    return (
      type === 'password' && (
        <button
          className={cn({
            [s.pass_show_btn]: true,
          })}
          type="button"
          onClick={() => setPassShown(!passShown)}
        >
          {passShown ? (
            <Eye className={s.icon_eye} />
          ) : (
            <EyeClosed className={s.icon_eye} />
          )}
        </button>
      )
    )
  }

  return (
    <div className={cn({ [s.field_wrapper]: true, [className]: className })}>
      {label && (
        <label htmlFor={name} className={s.label}>
          {label}
        </label>
      )}
      <div className={s.input_wrapper}>
        <Field
          disabled={disabled}
          data-testid={dataTestid}
          className={cn({
            [s.input]: true,
            [s.iconLeft]: iconLeft,
            [s.iconRight]: iconRight || type === 'password',
            [s.shadow]: isShadow,
            [s.field_bgc]: background,
            [s.error]: error && touched,
          })}
          style={{ height }}
          id={name}
          name={name}
          type={passShown ? 'text' : type}
          placeholder={placeholder}
          autoComplete={autoComplete ? 1 : 0}
        />
        {tabletOrHigher && iconLeft && renderIcon(iconLeft, 'left')}
        {tabletOrHigher && type !== 'password' && renderIcon(iconRight, 'right')}
        {renderPasswordShown(type)}
      </div>
      <ErrorMessage className={s.error_message} name={name} component="span" />
    </div>
  )
}

Component.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  iconRight: PropTypes.oneOf(['envelope', 'padlock', 'search', 'person']),
  iconLeft: PropTypes.oneOf(['envelope', 'padlock', 'search', 'person']),
  placeholder: PropTypes.string,
  className: PropTypes.string,
  dataTestid: PropTypes.string,
  type: PropTypes.oneOf(['text', 'email', 'number', 'password']),
  name: PropTypes.string.isRequired,
  error: PropTypes.bool.isRequired,
  touched: PropTypes.bool.isRequired,
  isShadow: PropTypes.bool.isRequired,
  autoComplete: PropTypes.bool,
  height: PropTypes.number,
  background: PropTypes.bool,
  disabled: PropTypes.bool,
}

Component.defaultProps = {
  type: 'text',
  isShadow: false,
  autoComplete: false,
  dataTestid: null,
  disabled: false,
}
