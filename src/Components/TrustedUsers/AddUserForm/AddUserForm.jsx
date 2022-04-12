import React from 'react'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { Form, Formik } from 'formik'

import { InputField, Button } from '../..'

import s from './AddUserForm.module.scss'

export default function AddUserForm() {
  const dispatch = useDispatch()

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^[^!@#$%^&*()\]~+/}[{=?|".':;]+$/g, 'Specials symbols aren"t allowed')
      .required('Name is required!'),
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
    dispatch(values)
  }

  return (
    <div>
      <div className={s.form_wrapper}>
        <div className={s.form}>
          <div className={s.form_title_wrapper}>
            <p className={s.form_title}>Добавить нового пользователя</p>
            <div className={s.close_btn_wrapper}>
              <button className={s.close_btn}></button>
            </div>
          </div>
          <Formik
            initialValues={{
              email: '',
              login: '',
              name: '',
              phone: '+380 ',
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
                    label={'Email'}
                    placeholder={'Введите данные'}
                    name="email"
                    error={!!errors.email}
                    touched={!!touched.email}
                    className={s.input_field_wrapper}
                  />

                  <InputField
                    label={'Логин:'}
                    placeholder={'Введите данные'}
                    name="login"
                    error={!!errors.login}
                    touched={!!touched.login}
                    className={s.input_field_wrapper}
                  />

                  <InputField
                    label={'ФИО:'}
                    placeholder={'Введите данные'}
                    name="name"
                    error={!!errors.name}
                    touched={!!touched.name}
                    className={s.input_field_wrapper}
                  />

                  <InputField
                    label={'Номер телефона:'}
                    name="phone"
                    error={!!errors.phone}
                    touched={!!touched.phone}
                    className={s.input_field_wrapper}
                  />

                  <InputField
                    label={'Пароль:'}
                    placeholder={'Введите пароль'}
                    name="password"
                    error={!!errors.password}
                    touched={!!touched.password}
                    type="password"
                    className={s.input_field_wrapper}
                  />

                  <InputField
                    label={'Подтверждение пароля:'}
                    placeholder={'Подтвердите пароль'}
                    name="passConfirmation"
                    error={!!errors.passConfirmation}
                    touched={!!touched.passConfirmation}
                    type="password"
                    className={s.input_field_wrapper}
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
