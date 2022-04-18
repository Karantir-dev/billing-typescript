import React from 'react'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { Form, Formik } from 'formik'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import { InputField, Button } from '../..'
import CustomPhoneInput from '../../ui/CustomPhoneInput/CustomPhoneInput'
import { usersOperations } from '../../../Redux/users/usersOperations'

import s from './AddUserForm.module.scss'

export default function AddUserForm({ controlForm, checkIfCreatedUser, dataTestid }) {
  const { t } = useTranslation('trusted_users')
  const dispatch = useDispatch()

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^[^!@#$%^&*()\]~+/}[{=?|".':;]+$/g, 'Specials symbols aren"t allowed')
      .required('Name is required!'),
    phone: Yup.string()
      .matches(
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
        'Incorrect number',
      )
      .min(7, 'phone number should have at least 4 digits')
      .required('Phone number is required!'),
    email: Yup.string().email('Incorrect email').required('Email is required!'),
    password: Yup.string()
      .min(6, 'invalide password')
      .max(48, 'invalide password')
      .required('Password is required!')
      .matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/, 'invalide password'),
    passConfirmation: Yup.string()
      .oneOf([Yup.ref('password')], 'passwords aren"t the same')
      .required('Password confirmation is required!'),
  })

  const handleSubmit = values => {
    const { email, name, phone, password } = values
    dispatch(
      usersOperations.createNewUser(password, email, phone, name, checkIfCreatedUser),
    )
    controlForm()
  }

  return (
    <div data-testid={dataTestid}>
      <div className={s.form_wrapper}>
        <div className={s.form}>
          <div className={s.form_title_wrapper}>
            <p className={s.form_title}>{t('trusted_users.form.title')}</p>
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
            {({ errors, touched, handleBlur, setFieldValue }) => {
              return (
                <Form>
                  <InputField
                    dataTestid="input_email"
                    label={requiredLabel(t('trusted_users.form.email'))}
                    placeholder={t('trusted_users.form_placeholders.email')}
                    name="email"
                    error={!!errors.email}
                    touched={!!touched.email}
                    className={s.field_input}
                    isShadow={true}
                    background={true}
                    autoComplete
                  />

                  <InputField
                    dataTestid="input_name"
                    label={requiredLabel(t('trusted_users.form.full_name'))}
                    placeholder={t('trusted_users.form_placeholders.full_name')}
                    name="name"
                    error={!!errors.name}
                    touched={!!touched.name}
                    className={s.field_input}
                    isShadow={true}
                    background={true}
                  />

                  <CustomPhoneInput
                    dataTestid="input_phone"
                    handleBlur={handleBlur}
                    setFieldValue={setFieldValue}
                    name="phone"
                  />

                  <InputField
                    dataTestid="input_password"
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
                    dataTestid="input_passConfirmation"
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
                    dataTestid="btn_form_submit"
                    size="large"
                    className={s.submit_btn}
                    label={'Save'.toUpperCase()}
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
    <>
      {labelName} {<span className={s.required_star}>*</span>}
    </>
  )
}

AddUserForm.propTypes = {
  controlForm: PropTypes.func,
  dataTestid: PropTypes.string,
  checkIfCreatedUser: PropTypes.func,
}
