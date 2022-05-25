import React, { useEffect, useState } from 'react'
// import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import s from './DedicOrderModal.module.scss'
import dedicOperations from '../../../../Redux/dedicatedServers/dedicOperations'
import dedicSelectors from '../../../../Redux/dedicatedServers/dedicSelectors'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import Select from '../../../ui/Select/Select'
import InputField from '../../../ui/InputField/InputField'
import classNames from 'classnames'

import { BreadCrumbs, Toggle } from '../../..'
import { useLocation } from 'react-router-dom'

export default function DedicOrderModal() {
  const dispatch = useDispatch()

  const tarifsList = useSelector(dedicSelectors.getTafifList)
  const { t } = useTranslation('container')

  const [tarifList, setTarifList] = useState(tarifsList)

  const location = useLocation()

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  useEffect(() => {
    dispatch(dedicOperations.getTarifs())
  }, [])

  useEffect(() => {
    setTarifList(tarifsList)
  }, [tarifsList])

  const validationSchema = Yup.object().shape({
    message: Yup.string().required(t('Is a required field')),
    subject: Yup.string().required(t('Is a required field')),
  })

  return (
    <div className={s.modalHeader}>
      <BreadCrumbs pathnames={parseLocations()} />
      <h2>{'Order DEDIC'}</h2>

      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={{
          datacenter: '',
          tarif: undefined,
          period: '',
          processor: '',
          parameters: {
            autoprolong: '',
            domenname: '',
            OS: '',
            previewPS: '',
            managePanel: '',
            ipTotal: '',
          },
        }}
        //   onSubmit={sendMessageHandle}
      >
        {({ values, setFieldValue, errors, touched }) => {
          console.log(values)
          return (
            <Form className={s.form}>
              <div className={s.datacenter_block}>
                {tarifList?.datacenter?.map(item => {
                  let country = item?.$?.split(',')[0]
                  let centerName = item?.$?.split(',')[1]

                  return (
                    <button
                      onClick={() => {
                        setFieldValue('datacenter', item?.$key)
                        dispatch(
                          dedicOperations.getUpdatedTarrifs(item?.$key, setTarifList),
                        )
                      }}
                      type="button"
                      className={classNames(s.datacenter_card, {
                        [s.selected]: item?.$key === values.datacenter,
                      })}
                      key={item?.$key}
                    >
                      <img
                        className={s.flag_icon}
                        src={require('../../../../images/countryFlags/nl.png')}
                        width={36}
                        height={24}
                        alt="flag"
                      />
                      <span className={s.country_name}>{country}</span>
                      <span>{centerName}</span>
                    </button>
                  )
                })}
              </div>

              <div className={s.processors_block}>
                {tarifList?.fpricelist?.map(item => {
                  return (
                    <div
                      className={classNames(s.processor_card, {
                        [s.selected]: true,
                      })}
                      key={item?.$key}
                    >
                      <Toggle
                        setValue={() => {
                          setFieldValue('processor', item?.$key)
                        }}
                      />
                      <span>{item?.$}</span>
                    </div>
                  )
                })}
              </div>

              <Select
                height={52}
                value={values}
                getElement={item => {
                  setFieldValue('period', item)
                  dispatch(dedicOperations.getUpdatedPeriod(item, setTarifList))
                }}
                isShadow
                label={'период оплаты'}
                itemsList={tarifList?.period?.map(el => {
                  return { label: t(el.$), value: el.$key }
                })}
                className={s.select}
              />

              <div className={s.tarifs_block}>
                {tarifList?.tarifList?.map(item => {
                  return (
                    <button
                      onClick={() => {
                        setFieldValue('tarif', item?.desc?.$)
                      }}
                      type="button"
                      className={classNames(s.tarif_card, {
                        [s.selected]: true,
                      })}
                      key={item?.desc?.$}
                    >
                      <span>{item?.desc?.$}</span>
                      <span>{item?.price?.$}</span>
                    </button>
                  )
                })}
              </div>

              <div className={s.parameters_block}>
                <Select
                  height={52}
                  value={values}
                  getElement={item => setFieldValue('parameters.utoprolong', item)}
                  isShadow
                  label={'Autoprolong'}
                  itemsList={tarifList?.period?.map(el => {
                    return { label: t(el.$), value: el.$ }
                  })}
                  className={s.select}
                />
                <InputField
                  label={'domenname'}
                  placeholder={'domenname'}
                  name="domenname"
                  isShadow
                  error={!!errors.domenname}
                  touched={!!touched.domenname}
                  className={s.input_field_wrapper}
                  autoComplete
                />
                <Select
                  height={52}
                  value={values}
                  getElement={item => setFieldValue('parameters.OS', item)}
                  isShadow
                  label={'OS'}
                  itemsList={tarifList?.period?.map(el => {
                    return { label: t(el.$), value: el.$ }
                  })}
                  className={s.select}
                />
                <InputField
                  label={'preview PS'}
                  value={values.parameters.OS}
                  placeholder={values.parameters.OS}
                  name="previewPS"
                  isShadow
                  error={!!errors.previewPS}
                  touched={!!touched.previewPS}
                  className={s.input_field_wrapper}
                  autoComplete
                />
                <Select
                  height={52}
                  value={values}
                  getElement={item => setFieldValue('parameters.managePanel', item)}
                  isShadow
                  label={'managePanel'}
                  itemsList={tarifList?.period?.map(el => {
                    return { label: t(el.$), value: el.$ }
                  })}
                  className={s.select}
                />
                <InputField
                  label={'Count ip'}
                  value={values.parameters.ipTotal}
                  placeholder={values.parameters.ipTotal}
                  name="ipTotal"
                  isShadow
                  error={!!errors.ipTotal}
                  touched={!!touched.ipTotal}
                  className={s.input_field_wrapper}
                  autoComplete
                />
              </div>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
