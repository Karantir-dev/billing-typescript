import React from 'react'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { Form, Formik } from 'formik'
import PropTypes from 'prop-types'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import i18n from 'i18next'

import { InputField, Button } from '../..'

import s from './AddUserForm.module.scss'
import { usersOperations } from '../../../Redux/users/usersOperations'
import classNames from 'classnames'

export default function AddUserForm({ controlForm, checkIfCreatedUser }) {
  const dispatch = useDispatch()

  const lang = i18n.language === 'en' ? 'es' : i18n.language
  const language = require(`react-phone-input-2/lang/${lang}.json`)

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^[^!@#$%^&*()\]~+/}[{=?|".':;]+$/g, 'Specials symbols aren"t allowed')
      .required('Name is required!'),
    phone: Yup.string()
      .min(13, 'too short')
      .max(13, 'too long')
      .matches(
        /^((\\+[1-9 ()+ ]{1,4}[ \\-]*)|(\\([0-9 ()+ ]{2,3}\\)[ \\-]*)|([0-9 ()+ ]{2,4})[ \\-]*)*?[0-9 ()+ ]{3,4}?[ \\-]*[0-9 ()+ ]{3,4}?$/,
        'Phone is not valid',
      ),
    phone2: Yup.string()
      .min(13, 'too short')
      .max(13, 'too long')
      .matches(
        /^((\\+[1-9 ()+ ]{1,4}[ \\-]*)|(\\([0-9 ()+ ]{2,3}\\)[ \\-]*)|([0-9 ()+ ]{2,4})[ \\-]*)*?[0-9 ()+ ]{3,4}?[ \\-]*[0-9 ()+ ]{3,4}?$/,
        'Phone is not valid',
      )
      .required('Phone number is required!'),
    email: Yup.string().email('Incorrect email').required('Email is required!'),
    password: Yup.string()
      .min(6, 'invalide password')
      .max(48, 'invalide password')
      .matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/, 'invalide password'),
    passConfirmation: Yup.string().oneOf(
      [Yup.ref('password')],
      'passwords aren"t the same',
    ),
  })

  const handleSubmit = values => {
    const { email, name, phone, password } = values
    dispatch(usersOperations.createNewUser(password, email, phone, name))
    controlForm()
    checkIfCreatedUser()
  }

  return (
    <div>
      <div className={s.form_wrapper}>
        <div className={s.form}>
          <div className={s.form_title_wrapper}>
            <p className={s.form_title}>Новый пользователь</p>
            <div className={s.close_btn_wrapper}>
              <button className={s.close_btn} onClick={controlForm}></button>
            </div>
          </div>
          <Formik
            initialValues={{
              email: '',
              name: '',
              phone: '+380',
              password: '',
              passConfirmation: '',
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {({ errors, touched }) => {
              return (
                <Form>
                  <InputField
                    label={requiredLabel('Email')}
                    placeholder={'Введите данные'}
                    name="email"
                    error={!!errors.email}
                    touched={!!touched.email}
                    className={s.field_input}
                    isShadow={true}
                    background={true}
                  />

                  <InputField
                    label={requiredLabel('ФИО:')}
                    placeholder={'Введите данные'}
                    name="name"
                    error={!!errors.name}
                    touched={!!touched.name}
                    className={s.field_input}
                    isShadow={true}
                    background={true}
                  />

                  {/* <InputField
                    label={requiredLabel('Номер телефона:')}
                    name="phone"
                    error={!!errors.phone}
                    touched={!!touched.phone}
                    className={s.field_input}
                    isShadow={true}
                    background={true}
                  /> */}

                  <div className={s.wrapper}>
                    <p> {requiredLabel('Номер телефона:')}</p>

                    <PhoneInput
                      country={'ua'}
                      localization={language}
                      name="phone"
                      error={!!errors.phone}
                      touched={!!touched.phone}
                      className={s.field_input}
                      containerClass={s.lang_container}
                      inputClass={classNames({ [s.field_input]: true, [s.lang]: true })}
                      buttonClass={classNames({
                        [s.lang_btn]: true,
                        [s.extra_style]: true,
                      })}
                      dropdownClass={classNames({
                        [s.drop_down]: true,
                        [s.list]: true,
                        [s.list_hover]: true,
                      })}
                      searchClass={classNames({
                        [s.drop_search]: true,
                        [s.list]: true,
                      })}
                      searchStyle={{ backgroundColor: 'red' }}
                    />
                  </div>

                  <InputField
                    label={requiredLabel('Пароль:')}
                    placeholder={'Введите пароль'}
                    name="password"
                    error={!!errors.password}
                    touched={!!touched.password}
                    type="password"
                    className={s.field_input}
                    isShadow={true}
                    background={true}
                  />

                  <InputField
                    label={requiredLabel('Подтверждение пароля:')}
                    placeholder={'Подтвердите пароль'}
                    name="passConfirmation"
                    error={!!errors.passConfirmation}
                    touched={!!touched.passConfirmation}
                    type="password"
                    className={s.field_input}
                    isShadow={true}
                    background={true}
                  />
                  <Button
                    size="large"
                    className={s.submit_btn}
                    label={'Save'}
                    type="submit"
                  />
                </Form>
              )
            }}
          </Formik>
        </div>
      </div>
    </div>
  )
}

function requiredLabel(labelName) {
  return (
    <p>
      {labelName} <span className={s.required_star}>*</span>
    </p>
  )
}

AddUserForm.propTypes = {
  controlForm: PropTypes.func,
}
