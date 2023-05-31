import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Cross } from '../../../../images'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import s from './DedicIPEditModal.module.scss'
import InputField from '../../../ui/InputField/InputField'

import { Button } from '../../..'
import { useLocation } from 'react-router-dom'
import { dedicOperations } from '../../../../Redux'

export default function DedicIPEditModal({ elid, closeFn }) {
  const { t } = useTranslation(['dedicated_servers', 'vds', 'other'])
  const dispatch = useDispatch()
  const [initialState, setInitialState] = useState()

  const location = useLocation()
  const ipPlid = location.state.plid

  const handleEditionModal = () => {
    closeFn()
  }

  useEffect(() => {
    dispatch(dedicOperations.getInfoEditIP(elid, ipPlid, setInitialState))
  }, [])

  const handleSubmit = values => {
    const { mask, gateway, domainname } = values

    dispatch(
      dedicOperations.editIP(elid, ipPlid, mask, gateway, domainname, handleEditionModal),
    )
  }

  const validationSchema = Yup.object().shape({
    domainname: Yup.string().matches(
      /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/,
      t('licence_error'),
    ),
  })

  return (
    <div className={s.modal}>
      <div className={s.header_block}>
        <div className={s.title_wrapper}>
          <h2 className={s.page_title}>{t('Editing a service', { ns: 'other' })}</h2>
          <span className={s.ip_id}>{initialState?.domain_name?.$}</span>
        </div>
        <Cross className={s.icon_cross} onClick={closeFn} width={17} height={17} />
      </div>

      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={{
          domainname: initialState?.domain?.$ || '',
          mask: initialState?.mask?.$ || '',
          gateway: initialState?.gateway?.$ || '',
        }}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched }) => {
          return (
            <Form>
              <div className={s.form}>
                <div className={s.parameters_block}>
                  <div className={s.parameters_wrapper}>
                    <div className={s.main_block}>
                      <InputField
                        label={t('domain_name')}
                        placeholder={t('domain_placeholder')}
                        name="domainname"
                        isShadow
                        error={!!errors.domainname}
                        touched={!!touched.domainname}
                        className={s.input_field_wrapper}
                        inputClassName={s.text_area}
                        autoComplete
                        type="text"
                        value={values?.domainname}
                      />
                      <InputField
                        label={`${t('mask')}:`}
                        name="mask"
                        isShadow
                        className={s.input_field_wrapper}
                        inputClassName={s.input}
                        autoComplete="off"
                        type="text"
                        value={values?.mask}
                        disabled
                      />

                      <InputField
                        label={`${t('gateway')}:`}
                        name="gateway"
                        isShadow
                        className={s.input_field_wrapper}
                        inputClassName={s.input}
                        autoComplete="off"
                        type="text"
                        value={values?.gateway}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className={s.btns_wrapper}>
                  <Button
                    className={s.buy_btn}
                    isShadow
                    size="medium"
                    label={t('Save', { ns: 'other' })}
                    type="submit"
                  />

                  <button
                    onClick={e => {
                      e.preventDefault()
                      closeFn()
                    }}
                    className={s.cancel_btn}
                  >
                    {t('Cancel', { ns: 'other' })}
                  </button>
                </div>
              </div>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
