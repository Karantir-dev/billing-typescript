import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { Link } from 'react-router-dom'
import { Icon } from '../Icon'

import authOperations from '../../Redux/auth/authOperations'
import * as Yup from 'yup'
import * as routes from '../../routes'
import cn from 'classnames'
import s from './PasswordChange.module.scss'
import { Form, Formik } from 'formik'

export function PasswordChange() {
  const tabletOrHigher = useMediaQuery({ query: '(min-width: 768px)' })
  const { t } = useTranslation()

  const dispatch = useDispatch()

  //   const [newPass, setNewPass] = useState('')
  //   const [confirmPass, setConfirmPass] = useState('')

  //   const [valid, setValid] = useState('')
  const [passShown, setPassShown] = useState(false)

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
      ),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref('password'), null],
      'Passwords must match',
    ),
  })

  //   const validPass = async () => {
  //     const isValid = await validationSchema.isValid({ newPass, confirmPass })
  //     const statePassword = isValid ? 'valid' : 'invalid'
  //     console.log({ newPass, confirmPass })
  //     setValid(statePassword)
  //     return statePassword
  //   }

  //   const handleSubmit = e => {
  //     e.preventDefault()
  //     console.log(valid)
  //     if (valid === 'valid') {
  //       dispatch(authOperations.changePassword(newPass))
  //     }
  //   }

  //   const handlePassword = e => {
  //     if (e.target.id === 'pass') {
  //       setNewPass(e.target.value)
  //     } else if (e.target.id === 'confPass') {
  //       setConfirmPass(e.target.value)
  //     }
  //   }

  return (
    <div className={s.form_wrapper}>
      <h3 className={s.form_title}>{t('change.passChangeTitle')}</h3>
      <Formik
        initialValues={{ password: '', confirmPassword: '' }}
        onSubmit={() => {}}
        validationSchema={validationSchema}
      >
        {({ values, errors, handleSubmit, handleChange, handleBlur }) => {
          return (
            <Form className={s.form} onSubmit={handleSubmit}>
              <div className={s.field_wrapper}>
                <label htmlFor="pass" className={s.label}>
                  {t('change.password')}
                </label>
                <div className={s.input_wrapper}>
                  {tabletOrHigher && (
                    <Icon
                      className={s.field_icon}
                      name="padlock"
                      width={19}
                      height={19}
                    />
                  )}
                  <input
                    className={cn({
                      [s.input]: true,
                      //   [s.error]: valid === 'invalid',
                    })}
                    id="pass"
                    name="password"
                    type={passShown ? 'text' : 'password'}
                    placeholder={t('change.changePass')}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                  />
                  <button
                    className={cn({
                      [s.pass_show_btn]: true,
                      [s.shown]: values.password,
                    })}
                    type="button"
                    onClick={() => setPassShown(!passShown)}
                  >
                    <Icon
                      className={s.icon_eye}
                      name={passShown ? 'closed-eye' : 'eye'}
                      width={21}
                      height={21}
                    ></Icon>
                  </button>
                  <div className={s.input_border}></div>
                </div>

                <span className={s.error_message}>{errors.password}</span>
              </div>

              <div className={s.field_wrapper}>
                <label htmlFor="confPass" className={s.label}>
                  {t('change.confirmation')}
                </label>
                <div className={s.input_wrapper}>
                  {tabletOrHigher && (
                    <Icon
                      className={s.field_icon}
                      name="padlock"
                      width={19}
                      height={19}
                    />
                  )}
                  <input
                    className={cn({
                      [s.input]: true,
                      //   [s.error]: valid === 'invalid',
                    })}
                    id="confPass"
                    name="confirmPassword"
                    type={passShown ? 'text' : 'password'}
                    placeholder={t('change.confPass')}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.confirmPassword}
                  />
                  <button
                    className={cn({
                      [s.pass_show_btn]: true,
                      [s.shown]: values.confirmPassword,
                    })}
                    type="button"
                    onClick={() => setPassShown(!passShown)}
                  >
                    <Icon
                      className={s.icon_eye}
                      name={passShown ? 'closed-eye' : 'eye'}
                      width={21}
                      height={21}
                    ></Icon>
                  </button>
                  <div className={s.input_border}></div>
                </div>

                <span className={s.error_message}>{errors.confirmPassword}</span>
              </div>

              <button className={s.submit_btn} type="submit">
                <span className={s.btn_text}>{t('change.save')}</span>
              </button>
              <Link className={s.reset_pass_link} to={routes.LOGIN}>
                {t('change.cancel')}
              </Link>
            </Form>
          )
        }}
      </Formik>
    </div>

    // <div className={s.form_wrapper}>
    //   <h3 className={s.form_title}>{t('change.passChangeTitle')}</h3>
    //   <form className={s.form} onSubmit={handleSubmit}>
    //     <div className={s.field_wrapper}>
    //       <label htmlFor="pass" className={s.label}>
    //         {t('change.password')}
    //       </label>
    //       <div className={s.input_wrapper}>
    //         {tabletOrHigher && (
    //           <Icon className={s.field_icon} name="padlock" width={19} height={19} />
    //         )}
    //         <input
    //           className={cn({ [s.input]: true, [s.error]: valid === 'invalid' })}
    //           id="pass"
    //           name="password"
    //           type={passShown ? 'text' : 'password'}
    //           placeholder={t('change.changePass')}
    //           onChange={handlePassword}
    //         />
    //         <button
    //           className={cn({ [s.pass_show_btn]: true, [s.shown]: !passShown })}
    //           type="button"
    //           onClick={() => setPassShown(!passShown)}
    //         >
    //           <Icon
    //             className={s.icon_eye}
    //             name={passShown ? 'closed-eye' : 'eye'}
    //             width={21}
    //             height={21}
    //           ></Icon>
    //         </button>
    //         <div className={s.input_border}></div>
    //       </div>
    //       {valid === 'invalid' && <span className={s.error_message}>{t('ERROR')}</span>}
    //     </div>

    //     <div className={s.field_wrapper}>
    //       <label htmlFor="confPass" className={s.label}>
    //         {t('change.confirmation')}
    //       </label>
    //       <div className={s.input_wrapper}>
    //         {tabletOrHigher && (
    //           <Icon className={s.field_icon} name="padlock" width={19} height={19} />
    //         )}
    //         <input
    //           className={cn({ [s.input]: true, [s.error]: valid === 'invalid' })}
    //           id="confPass"
    //           name="confPass"
    //           type={passShown ? 'text' : 'password'}
    //           placeholder={t('change.confPass')}
    //           onChange={handlePassword}
    //         />
    //         <button
    //           className={cn({ [s.pass_show_btn]: true, [s.shown]: !passShown })}
    //           type="button"
    //           onClick={() => setPassShown(!passShown)}
    //         >
    //           <Icon
    //             className={s.icon_eye}
    //             name={passShown ? 'closed-eye' : 'eye'}
    //             width={21}
    //             height={21}
    //           ></Icon>
    //         </button>
    //         <div className={s.input_border}></div>
    //       </div>
    //       {valid === 'invalid' && <span className={s.error_message}>{t('ERROR')}</span>}
    //     </div>

    //     <button className={s.submit_btn} type="submit" onClick={validPass}>
    //       <span className={s.btn_text}>{t('change.save')}</span>
    //     </button>
    //     <Link className={s.reset_pass_link} to={routes.LOGIN}>
    //       {t('change.cancel')}
    //     </Link>
    //   </form>
    // </div>
  )
}
