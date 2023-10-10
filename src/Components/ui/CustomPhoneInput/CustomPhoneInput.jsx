import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import PhoneInput from 'react-phone-input-2'
import cn from 'classnames'
import 'react-phone-input-2/lib/style.css'
import { ErrorMessage } from 'formik'
import i18n from 'i18next'

import { returnLanguage } from './langimport'
import { selectors } from '@redux'

import s from './CustomPhoneInput.module.scss'

export default function CustomPhoneInput(props) {
  const {
    handleBlur,
    setFieldValue,
    label,
    name,
    labelClass,
    containerClass,
    wrapperClass,
    inputClass,
    userId,
    isRequired,
    buttonClass,
    setCountryCode,
    country = 'us',
    ...restProps
  } = props

  const darkTheme = useSelector(selectors.getTheme) === 'dark'

  const lang = returnLanguage(i18n.language === 'en' ? 'es' : i18n.language)

  const onValueChange = (value, data) => {
    setCountryCode && setCountryCode(data?.countryCode)
    setFieldValue(userId ? 'phone' + userId : name, value)
  }

  return (
    <div className={cn(s.wrapper, wrapperClass)}>
      <p className={cn(s.phone_label, labelClass)}>
        {isRequired ? requiredLabel(label) : label}
      </p>
      <PhoneInput
        country={country}
        localization={lang}
        onChange={onValueChange}
        onBlur={handleBlur}
        name={name}
        className={s.field_input}
        containerClass={cn(s.lang_container, containerClass)}
        inputProps={{
          name,
        }}
        inputClass={cn({
          [s.react_phone_input]: true,
          [s.lang]: true,
          [s.field_input]: true,
          [inputClass]: inputClass,
        })}
        buttonClass={cn({
          [s.lang_btn]: true,
          [s.extra_style]: true,
          [s.opened]: true,
          [s.lightTheme]: !darkTheme,
          [buttonClass]: buttonClass,
        })}
        dropdownClass={cn({
          [s.drop_down]: true,
          [s.list]: true,
          [s.list_hover]: true,
          [s.lightThemeDrop]: !darkTheme,
        })}
        searchClass={cn({
          [s.drop_search]: true,
          [s.list]: true,
        })}
        searchStyle={{ backgroundColor: 'red' }}
        {...restProps}
      />

      <ErrorMessage
        name={userId ? 'phone' + userId : name}
        component="span"
        className={s.error_message}
      />
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

CustomPhoneInput.defaultProps = {
  type: 'text',
  placeholder: '',
  name: '',
  className: '',
  userId: '',
  isRequired: false,
}

CustomPhoneInput.propTypes = {
  name: PropTypes.string,
  placeholder: PropTypes.string,
  wrapperClass: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  handleBlur: PropTypes.func.isRequired,
  label: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  labelClass: PropTypes.string,
  inputClass: PropTypes.string,
  isRequired: PropTypes.bool,
}
