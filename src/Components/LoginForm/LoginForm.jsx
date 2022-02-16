import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

import authOperations from '../../Redux/auth/authOperations'

export function LoginForm() {
  const dispatch = useDispatch()

  const handleSubmit = ({ email, password }) => {
    dispatch(authOperations.login(email, password))
  }

  return (
    <div className="">
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <Form>
          <label htmlFor="email" className="">
            Email Adress:
          </label>
          <Field name="email" type="email" />
          <ErrorMessage name="email" />

          <label htmlFor="password" className="">
            Password:
          </label>
          <Field name="password" type="password" />
          <ErrorMessage name="password" />

          <button type="submit">LOG IN</button>
        </Form>
      </Formik>
    </div>
  )
}

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Введите валидный email').required('Введите email'),
  password: Yup.string().required('Введите пароль'),
})
