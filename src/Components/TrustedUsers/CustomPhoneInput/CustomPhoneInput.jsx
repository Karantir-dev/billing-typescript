import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import PhoneInput from 'react-phone-input-2'
import classNames from 'classnames'
// import i18n from 'i18next'

import { selectors } from '../../../Redux/selectors'
import { requiredLabel } from '../AddUserForm/AddUserForm'

import s from './CustomPhoneInput.module.scss'

export default function CustomPhoneInput(props) {
  const { handleChange, handleBlur, placeholder, name, ...restProps } = props

  const darkTheme = useSelector(selectors.getTheme) === 'dark'

  // const lang = i18n.language === 'en' ? 'es' : i18n.language
  // const language = require(`react-phone-input-2/lang/${lang}.json`)
  const language = require('react-phone-input-2/lang/es.json')

  const onValueChange = (phoneNumber, country, e) => {
    handleChange(e)
  }

  useEffect(() => {
    document.querySelector('input[type="tel"]').setAttribute('name', name)
  }, [])

  return (
    <div className={s.wrapper}>
      <p className={s.phone_label}> {requiredLabel('Номер телефона:')}</p>

      <PhoneInput
        {...restProps}
        placeholder={placeholder}
        country={'ua'}
        localization={language}
        onChange={onValueChange}
        onBlur={handleBlur}
        name={name}
        className={s.field_input}
        containerClass={s.lang_container}
        inputClass={classNames({
          [s.react_phone_input]: true,
          [s.lang]: true,
          [s.field_input]: true,
        })}
        buttonClass={classNames({
          [s.lang_btn]: true,
          [s.extra_style]: true,
          [s.opened]: true,
          [s.lightTheme]: !darkTheme,
        })}
        dropdownClass={classNames({
          [s.drop_down]: true,
          [s.list]: true,
          [s.list_hover]: true,
          [s.lightThemeDrop]: !darkTheme,
        })}
        searchClass={classNames({
          [s.drop_search]: true,
          [s.list]: true,
        })}
        searchStyle={{ backgroundColor: 'red' }}
      />
    </div>
  )
}

CustomPhoneInput.defaultProps = {
  type: 'text',
  placeholder: '',
  name: '',
  className: '',
}

CustomPhoneInput.propTypes = {
  name: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
}
