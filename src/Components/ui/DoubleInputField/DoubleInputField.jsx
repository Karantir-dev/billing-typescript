import { useRef, useState } from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { CalendarModal } from '../..'
import { Calendar } from '@images'
import { useOutsideAlerter } from '@utils'
import dayjs from 'dayjs'
import s from './DoubleInputField.module.scss'

export default function InputField(props) {
  const {
    label,
    type,
    placeholderLeft,
    placeholderRight,
    nameLeft,
    nameRight,
    isShadow, // shadow or border
    className,
    disabled,
    inputWrapperClass,
    inputClassName,
    isRequired,

    onChangeLeft,
    valueLeft,
    onChangeRight,
    valueRight,

    textLeft,
    textRight,

    maxLengthLeft,
    maxLengthRight,

    isCalendar,
    dates,
    setFieldValue,
    range,
  } = props

  const dropdownCalendar = useRef(null)
  const [isOpenedCalendar, setIsOpenedCalendar] = useState(false)

  const clickOutsideCalendar = () => {
    setIsOpenedCalendar(false)
  }

  useOutsideAlerter(dropdownCalendar, isOpenedCalendar, clickOutsideCalendar)

  return (
    <div className={cn({ [s.field_wrapper]: true, [className]: className })}>
      {label && (
        <label className={s.label}>{isRequired ? requiredLabel(label) : label}</label>
      )}
      <div
        role="button"
        tabIndex={0}
        onKeyDown={null}
        onClick={() => setIsOpenedCalendar(true)}
        className={cn(s.input_wrapper, inputWrapperClass, {
          [s.shadow]: isShadow,
          [s.calendarPicker]: isCalendar,
        })}
      >
        {isCalendar && <Calendar className={s.calendarIcon} />}
        {isCalendar ? (
          <div className={cn(s.datesText, { [s.placeholderDate]: !valueLeft })}>
            {valueLeft ? dayjs(valueLeft).format('YY/MM/DD') : placeholderLeft}
          </div>
        ) : (
          <input
            disabled={disabled || isCalendar}
            className={cn({
              [s.input]: true,
              [inputClassName]: inputClassName,
            })}
            id={nameLeft}
            name={nameLeft}
            type={type}
            placeholder={placeholderLeft}
            onChange={onChangeLeft}
            value={valueLeft}
            maxLength={maxLengthLeft}
            autoComplete="off"
          />
        )}

        {textLeft && !isCalendar && <div className={s.afterIputText}>{textLeft}</div>}
        <div className={s.line} />
        {isCalendar ? (
          <div className={cn(s.datesText, { [s.placeholderDate]: !valueRight })}>
            {valueRight ? dayjs(valueRight).format('YY/MM/DD') : placeholderRight}
          </div>
        ) : (
          <input
            disabled={disabled || isCalendar}
            className={cn({
              [s.input]: true,
              [inputClassName]: inputClassName,
            })}
            id={nameRight}
            name={nameRight}
            type={type}
            placeholder={placeholderRight}
            onChange={onChangeRight}
            value={valueRight}
            maxLength={maxLengthRight}
            autoComplete="off"
          />
        )}
        {textRight && !isCalendar && <div className={s.afterIputText}>{textRight}</div>}

        {isCalendar && (
          <div
            ref={dropdownCalendar}
            className={cn(s.calendarModal, { [s.opened]: isOpenedCalendar })}
          >
            <CalendarModal
              pointerClassName={s.calendar_pointer}
              value={dates}
              setStartDate={item => {
                setFieldValue && setFieldValue(nameLeft, item)
              }}
              setEndDate={item => setFieldValue && setFieldValue(nameRight, item)}
              range={range}
            />
          </div>
        )}
      </div>
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
  placeholderLeft: PropTypes.string,
  placeholderRight: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.oneOf(['text', 'email', 'number', 'password']),
  nameLeft: PropTypes.string.isRequired,
  nameRight: PropTypes.string.isRequired,
  error: PropTypes.bool,
  touched: PropTypes.bool,
  isShadow: PropTypes.bool.isRequired,
  height: PropTypes.number,
  background: PropTypes.bool,
  disabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  inputWrapperClass: PropTypes.string,
  inputClassName: PropTypes.string,

  onChangeLeft: PropTypes.func.isRequired,
  valueLeft: PropTypes.string.isRequired,
  onChangeRight: PropTypes.func.isRequired,
  valueRight: PropTypes.string.isRequired,

  textLeft: PropTypes.string,
  textRight: PropTypes.string,

  maxLengthLeft: PropTypes.number,
  maxLengthRight: PropTypes.number,
}

InputField.defaultProps = {
  type: 'text',
  isShadow: false,
  disabled: false,
  isRequired: false,
}
