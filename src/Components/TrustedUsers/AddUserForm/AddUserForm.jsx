import React from 'react'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { Form, Formik } from 'formik'
import PropTypes from 'prop-types'
import 'react-phone-input-2/lib/style.css'

import { InputField, Button } from '../..'
import { usersOperations } from '../../../Redux/users/usersOperations'
import CustomPhoneInput from '../CustomPhoneInput/CustomPhoneInput'
import s from './AddUserForm.module.scss'

export default function AddUserForm({ controlForm, checkIfCreatedUser }) {
  const dispatch = useDispatch()

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^[^!@#$%^&*()\]~+/}[{=?|".':;]+$/g, 'Specials symbols aren"t allowed')
      .required('Name is required!'),
    phone: Yup.string()
      .min(6, 'invalide password')
      .max(20, 'invalide password')
      .required('Phone is required!'),
    email: Yup.string().email('Incorrect email').required('Email is required!'),
    password: Yup.string()
      .min(6, 'invalide password')
      .max(48, 'invalide password')
      .required('Password is required!')
      .matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/, 'invalide password'),
    passConfirmation: Yup.string().oneOf(
      [Yup.ref('password')],
      'passwords aren"t the same',
    ),
  })

  const handleSubmit = values => {
    const { email, name, phone, password } = values
    console.log(values)
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
              phone: '',
              password: '',
              passConfirmation: '',
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {({ errors, touched, handleBlur, handleChange }) => {
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

                  <CustomPhoneInput
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    name="phone"
                  />

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

export function requiredLabel(labelName) {
  return (
    <p>
      {labelName} <span className={s.required_star}>*</span>
    </p>
  )
}

AddUserForm.propTypes = {
  controlForm: PropTypes.func,
}
