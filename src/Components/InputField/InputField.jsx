import React, { useState } from 'react'
import { ErrorMessage, Field } from 'formik'
import { useMediaQuery } from 'react-responsive'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { Icon } from '..'
import s from './InputField.module.scss'

export default function InputField({ label, icon, error, touched, inputValue }) {
  const tabletOrHigher = useMediaQuery({ query: '(min-width: 768px)' })
  const { t } = useTranslation()
  const inputTypePassword = label === 'password' || label === 'passConfirmation'
  const [passShown, setPassShown] = useState(false)

  return (
    <div className={s.field_wrapper}>
      <label className={s.label}>{t(`${label}_label`)}</label>
      <div className={s.input_wrapper}>
        <Field
          className={cn({
            [s.input]: true,
            [s.pr]: inputTypePassword,
            [s.error]: error && touched,
          })}
          name={label}
          type={inputTypePassword && !passShown ? 'password' : 'text'}
          placeholder={t(`${label}_placeholder`)}
        />
        {tabletOrHigher && (
          <Icon className={s.field_icon} name={icon} width={18} height={19} />
        )}
        <div className={s.input_border}></div>

        <button
          className={cn({
            [s.pass_show_btn]: true,
            [s.shown]: inputValue,
          })}
          type="button"
          onClick={() => setPassShown(!passShown)}
        >
          <Icon
            className={s.icon_eye}
            name={passShown ? 'closed-eye' : 'eye'}
            width={20}
            height={13}
          ></Icon>
        </button>
      </div>
      <ErrorMessage className={s.error_message} name={label} component="span" />
    </div>
  )
}

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.bool.isRequired,
  touched: PropTypes.bool.isRequired,
  inputValue: PropTypes.bool,
}
