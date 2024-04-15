import { useState } from 'react'
import { ErrorMessage, Field } from 'formik'
import { useMediaQuery } from 'react-responsive'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { Icon } from '@components'
import s from './InputField.module.scss'
import { generatePassword } from '@utils'

const InputField = function InputField(props) {
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
    inputWrapperClass,
    inputClassName,
    onKeyDown,
    isRequired,
    inputAuth,
    onPlusClick,
    infoText,
    generatePasswordValue,
    ...anotherProps
  } = props

  const tabletOrHigher = useMediaQuery({ query: '(min-width: 768px)' })
  const [passShown, setPassShown] = useState(false)

  const [isFocused, setIsFocused] = useState(false)

  const renderIcon = (name, position) => {
    const pos = position === 'left' ? s.field_icon_left : s.field_icon_right
    switch (name) {
      case 'envelope':
        return <Icon name="Envelope" className={pos} />
      case 'padlock':
        return <Icon name="Padlock" className={pos} />
      case 'search':
        return <Icon name="Search" className={pos} />
      case 'person':
        return <Icon name="Person" className={pos} />
      case 'copy':
        return <Icon name="Copy" className={pos} />
      case 'plus':
        return (
          <Icon
            name="Plus"
            onClick={() => onPlusClick && onPlusClick()}
            className={cn(pos, s.plusIcon)}
          />
        )
      default:
        return null
    }
  }

  const generatePasswordHandler = () =>
    generatePasswordValue(
      generatePassword({
        length: 10,
        includeLowerCase: true,
        includeNumber: true,
        includeUpperCase: true,
      }),
    )

  const renderPasswordShown = type => {
    return (
      type === 'password' && (
        <>
          {generatePasswordValue && (
            <button
              className={s.generate_pass_btn}
              type="button"
              onClick={generatePasswordHandler}
            >
              <Icon name="Cube" />
            </button>
          )}
          <button
            className={cn({
              [s.pass_show_btn]: true,
            })}
            type="button"
            onClick={() => setPassShown(!passShown)}
          >
            {passShown ? (
              <Icon name="Eye" className={s.icon_eye} />
            ) : (
              <Icon name="EyeClosed" className={s.icon_eye} />
            )}
          </button>
        </>
      )
    )
  }

  return (
    <div className={cn({ [s.field_wrapper]: true, [className]: className })}>
      {label && (
        <label htmlFor={name} className={s.label}>
          {isRequired ? requiredLabel(label) : label}
        </label>
      )}
      <div
        className={cn(s.input_wrapper, inputWrapperClass, {
          [s.focused]: isFocused,
        })}
        style={{ height }}
      >
        <Field
          disabled={disabled}
          data-testid={dataTestid}
          className={cn({
            [s.input]: true,
            [s.inputAuth]: inputAuth,
            [s.iconLeft]: iconLeft,
            [s.iconRight]: iconRight || type === 'password' || infoText,
            [s.shadow]: isShadow,
            [s.field_bgc]: background,
            [s.error]: error && touched,
            [s.disabled]: disabled,
            [s.number]: type === 'number',
            [inputClassName]: inputClassName,
            [s.icon_generate]: !!generatePassword,
          })}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          id={name}
          name={name}
          type={passShown ? 'text' : type}
          placeholder={placeholder}
          onKeyDown={onKeyDown}
          autoComplete={autoComplete}
          {...anotherProps}
        />
        {tabletOrHigher && iconLeft && renderIcon(iconLeft, 'left')}
        {tabletOrHigher && type !== 'password' && renderIcon(iconRight, 'right')}

        {renderPasswordShown(type)}
        {infoText && (
          <>
            <button type="button" className={s.infoBtn}>
              <Icon name="Info" />
            </button>
            <div className={s.infoText}>{infoText}</div>
          </>
        )}
      </div>
      <ErrorMessage className={s.error_message} name={name} component="span" />
    </div>
  )
}

function requiredLabel(labelName) {
  return (
    <>
      {labelName} {<span className={s.required_star}>*</span>}
    </>
  )
}

InputField.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  iconRight: PropTypes.oneOf(['envelope', 'padlock', 'search', 'person', 'copy', 'plus']),
  iconLeft: PropTypes.oneOf(['envelope', 'padlock', 'search', 'person', 'plus', 'copy']),
  placeholder: PropTypes.string,
  className: PropTypes.string,
  dataTestid: PropTypes.string,
  type: PropTypes.oneOf(['text', 'email', 'number', 'password']),
  as: PropTypes.string,
  name: PropTypes.string.isRequired,
  error: PropTypes.bool,
  touched: PropTypes.bool,
  isShadow: PropTypes.bool.isRequired,
  autoComplete: PropTypes.oneOf(['on', 'off', 'new-password']),
  height: PropTypes.number,
  background: PropTypes.bool,
  disabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  inputAuth: PropTypes.bool,
  inputWrapperClass: PropTypes.string,
  inputClassName: PropTypes.string,
  onKeyDown: PropTypes.func,
  onPlusClick: PropTypes.func,
}

InputField.defaultProps = {
  type: 'text',
  isShadow: false,
  autoComplete: 'off',
  dataTestid: null,
  disabled: false,
  isRequired: false,
  inputAuth: false,
  onKeyDown: () => null,
  onPlusClick: () => null,
}

export default InputField
