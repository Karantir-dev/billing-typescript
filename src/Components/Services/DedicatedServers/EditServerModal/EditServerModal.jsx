import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Cross } from '../../../../images'
import dedicOperations from '../../../../Redux/dedicatedServers/dedicOperations'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import s from './EditServerModal.module.scss'
import InputField from '../../../ui/InputField/InputField'
import Select from '../../../ui/Select/Select'
import { Button } from '../../..'

export default function EditServerModal({ elid, closeFn }) {
  const { t } = useTranslation(['dedicated_servers', 'vds', 'other'])
  const dispatch = useDispatch()
  const [initialState, setInitialState] = useState()
  const [price, setPrice] = useState()

  const handleEditionModal = () => {
    closeFn()
  }

  useEffect(() => {
    dispatch(dedicOperations.getCurrentDedicInfo(elid, setInitialState))
  }, [])
  useEffect(() => {
    setPrice(initialState?.cost?.$)
  }, [initialState])

  console.log(initialState)
  const handleSubmit = values => {
    const {
      elid,
      autoprolong,
      domainname,
      ostempl,
      recipe,
      managePanel,
      managePanelName,
      ipTotal,
      ipName,
    } = values

    dispatch(
      dedicOperations.editDedicServer(
        elid,
        autoprolong,
        domainname,
        ostempl,
        recipe,
        managePanel,
        managePanelName,
        ipTotal,
        ipName,

        handleEditionModal,
      ),
    )
  }

  const validationSchema = Yup.object().shape({
    domainname: Yup.string().matches(
      /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/,
      t('licence_error'),
    ),
  })

  return (
    <Formik
      enableReinitialize
      validationSchema={validationSchema}
      initialValues={{
        elid,
        domainname: initialState?.domain?.$ || '',
        ipTotal: initialState?.ipamount?.$ || null,
        price: null,
        autoprolong: initialState?.autoprolong?.$ || null,
        ostempl: initialState?.ostempl?.$ || null,
        recipe: initialState?.recipe?.$ || null,
        managePanel: initialState?.managePanel,
        managePanelName: initialState?.managePanelName || null,
        ipName: initialState?.amountIPName,
        pricelist: initialState?.pricelist?.$,
        period: initialState?.period?.$,
      }}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, touched, errors }) => {
        console.log(values)
        console.log(errors)

        return (
          <Form className={s.form}>
            <div className={s.parameters_block}>
              <div className={s.header_block}>
                <div className={s.title_wrapper}>
                  <h2 className={s.page_title}>
                    {t('Editing a service', { ns: 'other' })}
                  </h2>
                  <span className={s.order_id}>{`(#${initialState?.id?.$})`}</span>
                </div>
                <Cross
                  className={s.icon_cross}
                  onClick={closeFn}
                  width={17}
                  height={17}
                />
              </div>

              <div className={s.creation_date_wrapper}>
                <span className={s.label}>{t('created', { ns: 'vds' })}:</span>
                <span className={s.value}>{initialState?.createdate?.$}</span>
              </div>

              <div className={s.parameters_wrapper}>
                <Select
                  height={50}
                  value={values.autoprolong}
                  label={t('autoprolong')}
                  getElement={item => setFieldValue('autoprolong', item)}
                  isShadow
                  itemsList={initialState?.autoprolonglList?.map(el => {
                    let labeltext = ''
                    if (el.$.includes('per month')) {
                      labeltext = el.$.replace('per month', t('per month'))
                    } else {
                      labeltext = t(el.$)
                    }

                    return {
                      label: labeltext,
                      value: el.$key,
                    }
                  })}
                  className={s.select}
                />
                <InputField
                  label={t('domain_name')}
                  placeholder={t('domain_placeholder')}
                  name="domainname"
                  isShadow
                  error={!!errors.domainname}
                  touched={!!touched.domainname}
                  className={s.input_field_wrapper}
                  inputClassName={s.domainname}
                  autoComplete
                  type="text"
                  value={values?.domainname}
                />

                <Select
                  height={50}
                  getElement={item => {
                    setFieldValue('ostempl', item)
                    setFieldValue('recipe', 'null')
                  }}
                  isShadow
                  label={t('os')}
                  value={values?.ostempl}
                  itemsList={initialState?.ostemplList?.map(el => {
                    return { label: t(el.$), value: el.$key }
                  })}
                  className={s.select}
                />

                <Select
                  height={50}
                  getElement={item => setFieldValue('recipe', item)}
                  isShadow
                  label={t('recipe')}
                  value={values?.recipe}
                  placeholder={t('recipe_placeholder')}
                  itemsList={initialState?.recipelList
                    ?.filter(e => {
                      return e.$depend === values.ostempl
                    })
                    .map(el => {
                      return {
                        label: el.$ === '-- none --' ? t('recipe_placeholder') : t(el.$),
                        value: el.$key,
                      }
                    })}
                  className={s.select}
                />

                <Select
                  height={50}
                  value={values?.managePanel}
                  getElement={item => {
                    setFieldValue('managePanel', item)
                    updatePrice({ ...values, managePanel: item }, dispatch, setPrice)
                  }}
                  isShadow
                  label={t('manage_panel')}
                  itemsList={initialState?.managePanellList?.map(el => {
                    let labelText = el.$

                    if (labelText.includes('Without a license')) {
                      labelText = labelText.replace(
                        'Without a license',
                        t('Without a license'),
                      )
                    }

                    if (labelText.includes('per month')) {
                      labelText = labelText.replace('per month', t('per month'))
                    }

                    if (labelText.includes('Unlimited domains')) {
                      labelText = labelText.replace(
                        'Unlimited domains',
                        t('Unlimited domains'),
                      )
                    }

                    if (labelText.includes('domains')) {
                      labelText = labelText.replace('domains', t('domains'))
                    }

                    return { label: labelText, value: el.$key }
                  })}
                  className={s.select}
                />

                <Select
                  height={50}
                  value={values?.ipTotal}
                  getElement={item => {
                    setFieldValue('ipTotal', item)
                    updatePrice({ ...values, ipTotal: item }, dispatch, setPrice)
                  }}
                  isShadow
                  label={t('count_ip')}
                  itemsList={['1', '2'].map(el => {
                    return { label: el, value: el }
                  })}
                  className={s.select}
                />
              </div>
            </div>

            <p>Price: {price}</p>

            <Button
              className={s.buy_btn}
              isShadow
              size="medium"
              label={t('Buy')}
              type="submit"
            />
            <button onClick={closeFn}>cancel</button>
          </Form>
        )
      }}
    </Formik>
  )
}

function updatePrice(formValues, dispatch, setNewPrice) {
  console.log(formValues.ipTotal)
  dispatch(
    dedicOperations.updatePrice(
      formValues.datacenter,
      formValues.period,
      formValues.pricelist,
      null,
      null,
      null,
      null,
      null,
      formValues.managePanelName,
      formValues.ipTotal,
      formValues.ipName,
      formValues.managePanel,
      setNewPrice,
    ),
  )
}
