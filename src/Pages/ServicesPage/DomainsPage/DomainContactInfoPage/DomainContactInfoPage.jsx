import React, { useEffect, useState } from 'react'
import {
  BreadCrumbs,
  InputField,
  CustomPhoneInput,
  Select,
  CheckBox,
  Button,
} from '../../../../Components'
import { useDispatch } from 'react-redux'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { Formik, Form } from 'formik'
import { domainsOperations } from '../../../../Redux'
import { Shevron } from '../../../../images'
import { BASE_URL } from '../../../../config/config'
import * as route from '../../../../routes'
import * as Yup from 'yup'
import s from './DomainContactInfoPage.module.scss'

export default function ServicesPage() {
  const { t } = useTranslation(['domains', 'other', 'trusted_users'])
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const location = useLocation()

  const [isOpenOwner, setIsOpenOwner] = useState(true)
  const [isOpenAdmin, setIsOpenAdmin] = useState(true)
  const [isOpenTech, setIsOpenTech] = useState(true)
  const [isOpenBill, setIsOpenBill] = useState(true)

  const [domainsContacts, setDomainsContacts] = useState(null)

  const { state } = location

  useEffect(() => {
    dispatch(domainsOperations.getDomainsContacts(setDomainsContacts, state?.domainInfo))
  }, [])

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  const validationSchema = Yup.object().shape({
    owner_name: Yup.string().required(t('Is a required field', { ns: 'other' })),
    owner_firstname: Yup.string().required(t('Is a required field', { ns: 'other' })),
    owner_firstname_locale: Yup.string().required(
      t('Is a required field', { ns: 'other' }),
    ),
    owner_lastname: Yup.string().required(t('Is a required field', { ns: 'other' })),
    owner_lastname_locale: Yup.string().required(
      t('Is a required field', { ns: 'other' }),
    ),
    owner_email: Yup.string().required(t('Is a required field', { ns: 'other' })),
    owner_phone: Yup.string()
      .min(7, t('trusted_users.form_errors.phone', { ns: 'trusted_users' }))
      .required(t('Is a required field', { ns: 'other' })),

    owner_location_country: Yup.string()
      .notOneOf(['null'], t('Is a required field', { ns: 'other' }))
      .required(t('Is a required field', { ns: 'other' })),
    owner_location_postcode: Yup.string().required(
      t('Is a required field', { ns: 'other' }),
    ),
    owner_location_state: Yup.string().required(
      t('Is a required field', { ns: 'other' }),
    ),
    owner_location_city: Yup.string().required(t('Is a required field', { ns: 'other' })),
    owner_location_address: Yup.string().required(
      t('Is a required field', { ns: 'other' }),
    ),

    /*============================================ADMIN============================================*/

    admin_name: Yup.string().when('admin_contact_use_first', {
      is: 'off',
      then: Yup.string().required(t('Is a required field', { ns: 'other' })),
    }),
    admin_firstname: Yup.string().when('admin_contact_use_first', {
      is: 'off',
      then: Yup.string().required(t('Is a required field', { ns: 'other' })),
    }),
    admin_firstname_locale: Yup.string().when('admin_contact_use_first', {
      is: 'off',
      then: Yup.string().required(t('Is a required field', { ns: 'other' })),
    }),
    admin_lastname: Yup.string().when('admin_contact_use_first', {
      is: 'off',
      then: Yup.string().required(t('Is a required field', { ns: 'other' })),
    }),
    admin_lastname_locale: Yup.string().when('admin_contact_use_first', {
      is: 'off',
      then: Yup.string().required(t('Is a required field', { ns: 'other' })),
    }),
    admin_email: Yup.string().when('admin_contact_use_first', {
      is: 'off',
      then: Yup.string().required(t('Is a required field', { ns: 'other' })),
    }),
    admin_phone: Yup.string().when('admin_contact_use_first', {
      is: 'off',
      then: Yup.string()
        .min(7, t('trusted_users.form_errors.phone', { ns: 'trusted_users' }))
        .required(t('Is a required field', { ns: 'other' })),
    }),

    admin_location_country: Yup.string().when('admin_contact_use_first', {
      is: 'off',
      then: Yup.string()
        .notOneOf(['null'], t('Is a required field', { ns: 'other' }))
        .required(t('Is a required field', { ns: 'other' })),
    }),

    admin_location_postcode: Yup.string().when('admin_contact_use_first', {
      is: 'off',
      then: Yup.string().required(t('Is a required field', { ns: 'other' })),
    }),
    admin_location_state: Yup.string().when('admin_contact_use_first', {
      is: 'off',
      then: Yup.string().required(t('Is a required field', { ns: 'other' })),
    }),
    admin_location_city: Yup.string().when('admin_contact_use_first', {
      is: 'off',
      then: Yup.string().required(t('Is a required field', { ns: 'other' })),
    }),
    admin_location_address: Yup.string().when('admin_contact_use_first', {
      is: 'off',
      then: Yup.string().required(t('Is a required field', { ns: 'other' })),
    }),

    /*============================================TECH============================================*/

    tech_name: Yup.string().when('tech_contact_use_first', {
      is: 'off',
      then: Yup.string().required(t('Is a required field', { ns: 'other' })),
    }),
    tech_firstname: Yup.string().when('tech_contact_use_first', {
      is: 'off',
      then: Yup.string().required(t('Is a required field', { ns: 'other' })),
    }),
    tech_firstname_locale: Yup.string().when('tech_contact_use_first', {
      is: 'off',
      then: Yup.string().required(t('Is a required field', { ns: 'other' })),
    }),
    tech_lastname: Yup.string().when('tech_contact_use_first', {
      is: 'off',
      then: Yup.string().required(t('Is a required field', { ns: 'other' })),
    }),
    tech_lastname_locale: Yup.string().when('tech_contact_use_first', {
      is: 'off',
      then: Yup.string().required(t('Is a required field', { ns: 'other' })),
    }),
    tech_email: Yup.string().when('tech_contact_use_first', {
      is: 'off',
      then: Yup.string().required(t('Is a required field', { ns: 'other' })),
    }),
    tech_phone: Yup.string().when('tech_contact_use_first', {
      is: 'off',
      then: Yup.string()
        .min(7, t('trusted_users.form_errors.phone', { ns: 'trusted_users' }))
        .required(t('Is a required field', { ns: 'other' })),
    }),

    tech_location_country: Yup.string().when('tech_contact_use_first', {
      is: 'off',
      then: Yup.string()
        .notOneOf(['null'], t('Is a required field', { ns: 'other' }))
        .required(t('Is a required field', { ns: 'other' })),
    }),

    tech_location_postcode: Yup.string().when('tech_contact_use_first', {
      is: 'off',
      then: Yup.string().required(t('Is a required field', { ns: 'other' })),
    }),
    tech_location_state: Yup.string().when('tech_contact_use_first', {
      is: 'off',
      then: Yup.string().required(t('Is a required field', { ns: 'other' })),
    }),
    tech_location_city: Yup.string().when('tech_contact_use_first', {
      is: 'off',
      then: Yup.string().required(t('Is a required field', { ns: 'other' })),
    }),
    tech_location_address: Yup.string().when('tech_contact_use_first', {
      is: 'off',
      then: Yup.string().required(t('Is a required field', { ns: 'other' })),
    }),

    /*============================================BILL============================================*/

    bill_name: Yup.string().when('bill_contact_use_first', {
      is: 'off',
      then: Yup.string().required(t('Is a required field', { ns: 'other' })),
    }),
    bill_firstname: Yup.string().when('bill_contact_use_first', {
      is: 'off',
      then: Yup.string().required(t('Is a required field', { ns: 'other' })),
    }),
    bill_firstname_locale: Yup.string().when('bill_contact_use_first', {
      is: 'off',
      then: Yup.string().required(t('Is a required field', { ns: 'other' })),
    }),
    bill_lastname: Yup.string().when('bill_contact_use_first', {
      is: 'off',
      then: Yup.string().required(t('Is a required field', { ns: 'other' })),
    }),
    bill_lastname_locale: Yup.string().when('bill_contact_use_first', {
      is: 'off',
      then: Yup.string().required(t('Is a required field', { ns: 'other' })),
    }),
    bill_email: Yup.string().when('bill_contact_use_first', {
      is: 'off',
      then: Yup.string().required(t('Is a required field', { ns: 'other' })),
    }),
    bill_phone: Yup.string().when('bill_contact_use_first', {
      is: 'off',
      then: Yup.string()
        .min(7, t('trusted_users.form_errors.phone', { ns: 'trusted_users' }))
        .required(t('Is a required field', { ns: 'other' })),
    }),

    bill_location_country: Yup.string().when('bill_contact_use_first', {
      is: 'off',
      then: Yup.string()
        .notOneOf(['null'], t('Is a required field', { ns: 'other' }))
        .required(t('Is a required field', { ns: 'other' })),
    }),

    bill_location_postcode: Yup.string().when('bill_contact_use_first', {
      is: 'off',
      then: Yup.string().required(t('Is a required field', { ns: 'other' })),
    }),
    bill_location_state: Yup.string().when('bill_contact_use_first', {
      is: 'off',
      then: Yup.string().required(t('Is a required field', { ns: 'other' })),
    }),
    bill_location_city: Yup.string().when('bill_contact_use_first', {
      is: 'off',
      then: Yup.string().required(t('Is a required field', { ns: 'other' })),
    }),
    bill_location_address: Yup.string().when('bill_contact_use_first', {
      is: 'off',
      then: Yup.string().required(t('Is a required field', { ns: 'other' })),
    }),
  })

  const setContactsHandler = values => {
    const data = { ...values, ...state?.domainInfo, period: '12', snext: 'ok', sok: 'ok' }
    dispatch(domainsOperations.getDomainsContacts(setDomainsContacts, data, navigate))
  }

  return (
    <div className={s.page_wrapper}>
      <BreadCrumbs pathnames={parseLocations()} />
      <button
        onClick={() => setIsOpenOwner(!isOpenOwner)}
        type="button"
        className={s.titleBlock}
      >
        <h1 className={s.page_title}>{t('Owner contacts')}</h1>
        <Shevron className={cn(s.shevronIcon, { [s.isOpen]: isOpenOwner })} />
      </button>
      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={{
          owner_contact_select: domainsContacts?.owner_contact_select || '',
          owner_name: domainsContacts?.owner_name?.$ || '',
          owner_profiletype: domainsContacts?.owner_profiletype || '',
          owner_email: domainsContacts?.owner_email?.$ || '',
          owner_phone: domainsContacts?.owner_phone || '',

          owner_firstname: domainsContacts?.owner_firstname?.$ || '',
          owner_firstname_locale: domainsContacts?.owner_firstname_locale?.$ || '',
          owner_lastname: domainsContacts?.owner_lastname?.$ || '',
          owner_lastname_locale: domainsContacts?.owner_lastname_locale?.$ || '',
          owner_middlename: domainsContacts?.owner_middlename?.$ || '',
          owner_middlename_locale: domainsContacts?.owner_middlename_locale?.$ || '',

          owner_location_country: domainsContacts?.owner_location_country || '',
          owner_location_postcode: domainsContacts?.owner_location_postcode?.$ || '',
          owner_location_state: domainsContacts?.owner_location_state?.$ || '',
          owner_location_city: domainsContacts?.owner_location_city?.$ || '',
          owner_location_address: domainsContacts?.owner_location_address?.$ || '',

          admin_contact_use_first: domainsContacts?.admin_contact_use_first || '',
          admin_contact_select: domainsContacts?.admin_contact_select || '',
          admin_name: domainsContacts?.admin_name?.$ || '',
          admin_profiletype: domainsContacts?.admin_profiletype || '',
          admin_email: domainsContacts?.admin_email?.$ || '',
          admin_phone: domainsContacts?.admin_phone || '',

          admin_firstname: domainsContacts?.admin_firstname?.$ || '',
          admin_firstname_locale: domainsContacts?.admin_firstname_locale?.$ || '',
          admin_lastname: domainsContacts?.admin_lastname?.$ || '',
          admin_lastname_locale: domainsContacts?.admin_lastname_locale?.$ || '',
          admin_middlename: domainsContacts?.admin_middlename?.$ || '',
          admin_middlename_locale: domainsContacts?.admin_middlename_locale?.$ || '',

          admin_location_country: domainsContacts?.admin_location_country || '',
          admin_location_postcode: domainsContacts?.admin_location_postcode?.$ || '',
          admin_location_state: domainsContacts?.admin_location_state?.$ || '',
          admin_location_city: domainsContacts?.admin_location_city?.$ || '',
          admin_location_address: domainsContacts?.admin_location_address?.$ || '',

          tech_contact_use_first: domainsContacts?.tech_contact_use_first || '',
          tech_contact_select: domainsContacts?.tech_contact_select || '',
          tech_name: domainsContacts?.tech_name?.$ || '',
          tech_profiletype: domainsContacts?.tech_profiletype || '',
          tech_email: domainsContacts?.tech_email?.$ || '',
          tech_phone: domainsContacts?.tech_phone || '',

          tech_firstname: domainsContacts?.tech_firstname?.$ || '',
          tech_firstname_locale: domainsContacts?.tech_firstname_locale?.$ || '',
          tech_lastname: domainsContacts?.tech_lastname?.$ || '',
          tech_lastname_locale: domainsContacts?.tech_lastname_locale?.$ || '',
          tech_middlename: domainsContacts?.tech_middlename?.$ || '',
          tech_middlename_locale: domainsContacts?.tech_middlename_locale?.$ || '',

          tech_location_country: domainsContacts?.tech_location_country || '',
          tech_location_postcode: domainsContacts?.tech_location_postcode?.$ || '',
          tech_location_state: domainsContacts?.tech_location_state?.$ || '',
          tech_location_city: domainsContacts?.tech_location_city?.$ || '',
          tech_location_address: domainsContacts?.tech_location_address?.$ || '',

          bill_contact_use_first: domainsContacts?.bill_contact_use_first || '',
          bill_contact_select: domainsContacts?.bill_contact_select || '',
          bill_name: domainsContacts?.bill_name?.$ || '',
          bill_profiletype: domainsContacts?.bill_profiletype || '',
          bill_email: domainsContacts?.bill_email?.$ || '',
          bill_phone: domainsContacts?.bill_phone || '',

          bill_firstname: domainsContacts?.bill_firstname?.$ || '',
          bill_firstname_locale: domainsContacts?.bill_firstname_locale?.$ || '',
          bill_lastname: domainsContacts?.bill_lastname?.$ || '',
          bill_lastname_locale: domainsContacts?.bill_lastname_locale?.$ || '',
          bill_middlename: domainsContacts?.bill_middlename?.$ || '',
          bill_middlename_locale: domainsContacts?.bill_middlename_locale?.$ || '',

          bill_location_country: domainsContacts?.bill_location_country || '',
          bill_location_postcode: domainsContacts?.bill_location_postcode?.$ || '',
          bill_location_state: domainsContacts?.bill_location_state?.$ || '',
          bill_location_city: domainsContacts?.bill_location_city?.$ || '',
          bill_location_address: domainsContacts?.bill_location_address?.$ || '',
        }}
        onSubmit={setContactsHandler}
      >
        {({ errors, touched, values, handleBlur, setFieldValue }) => {
          const onOwnerContactChange = item => {
            const body = {
              ...state?.domainInfo,
              owner_contact_select: item,
              admin_contact_select: values.admin_contact_select,
              admin_contact_use_first: values.admin_contact_use_first,
              tech_contact_use_first: values.tech_contact_use_first,
              tech_contact_select: values.tech_contact_select,
              bill_contact_select: values.bill_contact_select,
              bill_contact_use_first: values.bill_contact_use_first,
            }

            dispatch(domainsOperations.getDomainsContacts(setDomainsContacts, body))
            setFieldValue('owner_contact_select', item)
          }

          const onAdminContactChange = item => {
            const body = {
              ...state?.domainInfo,
              admin_contact_select: item,
              admin_contact_use_first: values.admin_contact_use_first,
              owner_contact_select: values.owner_contact_select,
              tech_contact_use_first: values.tech_contact_use_first,
              tech_contact_select: values.tech_contact_select,
              bill_contact_select: values.bill_contact_select,
              bill_contact_use_first: values.bill_contact_use_first,
            }

            dispatch(domainsOperations.getDomainsContacts(setDomainsContacts, body))
            setFieldValue('admin_contact_select', item)
          }

          const onTechContactChange = item => {
            const body = {
              ...state?.domainInfo,
              tech_contact_select: item,
              tech_contact_use_first: values.tech_contact_use_first,
              owner_contact_select: values.owner_contact_select,
              admin_contact_select: values.admin_contact_select,
              admin_contact_use_first: values.admin_contact_use_first,
              bill_contact_select: values.bill_contact_select,
              bill_contact_use_first: values.bill_contact_use_first,
            }

            dispatch(domainsOperations.getDomainsContacts(setDomainsContacts, body))
            setFieldValue('tech_contact_select', item)
          }

          const onBillContactChange = item => {
            const body = {
              ...state?.domainInfo,
              bill_contact_select: item,
              bill_contact_use_first: values.bill_contact_use_first,
              owner_contact_select: values.owner_contact_select,
              admin_contact_select: values.admin_contact_select,
              admin_contact_use_first: values.admin_contact_use_first,
              tech_contact_use_first: values.tech_contact_use_first,
              tech_contact_select: values.tech_contact_select,
            }

            dispatch(domainsOperations.getDomainsContacts(setDomainsContacts, body))
            setFieldValue('bill_contact_select', item)
          }

          return (
            <Form>
              {/*============================================OWNER============================================*/}
              <div className={cn(s.ownerForm, { [s.isOpen]: isOpenOwner })}>
                <div className={s.formBlock}>
                  <div className={s.formFieldsBlock}>
                    <Select
                      placeholder={t('Not chosen', { ns: 'other' })}
                      label={`${t('Use contact')}:`}
                      value={values.owner_contact_select}
                      getElement={item => onOwnerContactChange(item)}
                      isShadow
                      className={s.select}
                      itemsList={domainsContacts?.owner_contact_select_list?.map(
                        ({ $key, $ }) => ({
                          label: t(`${$.trim()}`),
                          value: $key,
                        }),
                      )}
                    />
                    <InputField
                      inputWrapperClass={s.inputHeight}
                      name="owner_name"
                      label={`${t('Profile name')}:`}
                      placeholder={t('Enter data', { ns: 'other' })}
                      isShadow
                      className={s.input}
                      error={!!errors.owner_name}
                      touched={!!touched.owner_name}
                      isRequired
                      disabled={domainsContacts?.owner_name?.$readonly === 'yes'}
                    />
                    <Select
                      placeholder={t('Not chosen', { ns: 'other' })}
                      label={`${t('Contact type')}:`}
                      value={values.owner_profiletype}
                      getElement={item => setFieldValue('owner_profiletype', item)}
                      isShadow
                      className={s.select}
                      itemsList={domainsContacts?.owner_profiletype_list?.map(
                        ({ $key, $ }) => ({
                          label: t(`${$.trim()}`),
                          value: $key,
                        }),
                      )}
                    />
                  </div>
                </div>

                <div className={s.formBlock}>
                  <div className={s.formBlockTitle}>{t('Contact person details')}</div>
                  <div className={s.formFieldsBlock}>
                    <InputField
                      inputWrapperClass={s.inputHeight}
                      name="owner_firstname_locale"
                      label={`${t('Name', { ns: 'other' })}:`}
                      placeholder={t('Enter name', { ns: 'other' })}
                      isShadow
                      className={s.input}
                      error={!!errors.owner_firstname_locale}
                      touched={!!touched.owner_firstname_locale}
                      isRequired
                      disabled={
                        domainsContacts?.owner_firstname_locale?.$readonly === 'yes'
                      }
                    />
                    <InputField
                      inputWrapperClass={s.inputHeight}
                      name="owner_firstname"
                      label={`${t('Name', { ns: 'other' })} (EN):`}
                      placeholder={t('Enter name', { ns: 'other' })}
                      isShadow
                      className={s.input}
                      error={!!errors.owner_firstname}
                      touched={!!touched.owner_firstname}
                      isRequired
                      disabled={domainsContacts?.owner_firstname?.$readonly === 'yes'}
                    />
                    <InputField
                      inputWrapperClass={s.inputHeight}
                      name="owner_lastname_locale"
                      label={`${t('Surname', { ns: 'other' })}:`}
                      placeholder={t('Enter surname', { ns: 'other' })}
                      isShadow
                      className={s.input}
                      error={!!errors.owner_lastname_locale}
                      touched={!!touched.owner_lastname_locale}
                      isRequired
                      disabled={
                        domainsContacts?.owner_lastname_locale?.$readonly === 'yes'
                      }
                    />
                    <InputField
                      inputWrapperClass={s.inputHeight}
                      name="owner_lastname"
                      label={`${t('Surname', { ns: 'other' })} (EN):`}
                      placeholder={t('Enter surname', { ns: 'other' })}
                      isShadow
                      className={s.input}
                      error={!!errors.owner_lastname}
                      touched={!!touched.owner_lastname}
                      isRequired
                      disabled={domainsContacts?.owner_lastname?.$readonly === 'yes'}
                    />
                    <InputField
                      inputWrapperClass={s.inputHeight}
                      name="owner_middlename_locale"
                      label={`${t('Middle name', { ns: 'other' })}:`}
                      placeholder={t('Enter middle name', { ns: 'other' })}
                      isShadow
                      className={s.input}
                      error={!!errors.owner_middlename_locale}
                      touched={!!touched.owner_middlename_locale}
                      disabled={
                        domainsContacts?.owner_middlename_locale?.$readonly === 'yes'
                      }
                    />
                    <InputField
                      inputWrapperClass={s.inputHeight}
                      name="owner_middlename"
                      label={`${t('Middle name', { ns: 'other' })} (EN):`}
                      placeholder={t('Enter middle name', { ns: 'other' })}
                      isShadow
                      className={s.input}
                      error={!!errors.owner_middlename}
                      touched={!!touched.owner_middlename}
                      disabled={domainsContacts?.owner_middlename?.$readonly === 'yes'}
                    />
                    <InputField
                      inputWrapperClass={s.inputHeight}
                      type="email"
                      name="owner_email"
                      label={`${t('Email')}:`}
                      placeholder={t('Enter email', { ns: 'other' })}
                      isShadow
                      className={s.input}
                      error={!!errors.owner_email}
                      touched={!!touched.owner_email}
                      isRequired
                      disabled={domainsContacts?.owner_email?.$readonly === 'yes'}
                    />
                    <CustomPhoneInput
                      containerClass={s.phoneInputContainer}
                      inputClass={s.phoneInputClass}
                      value={values.owner_phone}
                      wrapperClass={s.phoneInput}
                      labelClass={s.phoneInputLabel}
                      label={`${t('Phone', { ns: 'other' })}:`}
                      handleBlur={handleBlur}
                      setFieldValue={setFieldValue}
                      name="owner_phone"
                      isRequired
                      disabled={domainsContacts?.owner_email?.$readonly === 'yes'}
                    />
                  </div>
                </div>

                <div className={s.formBlock}>
                  <div className={s.formBlockTitle}>{t('Contact address')}</div>
                  <div className={s.formFieldsBlock}>
                    <Select
                      placeholder={t('Not chosen', { ns: 'other' })}
                      label={`${t('The country', { ns: 'other' })}:`}
                      value={values.owner_location_country}
                      getElement={item => setFieldValue('owner_location_country', item)}
                      isShadow
                      className={s.select}
                      itemsList={domainsContacts?.owner_location_country_list?.map(
                        ({ $key, $, $image }) => ({
                          label: (
                            <div className={s.countrySelectItem}>
                              {$key !== 'null' && (
                                <img src={`${BASE_URL}${$image}`} alt="flag" />
                              )}
                              {t(`${$.trim()}`)}
                            </div>
                          ),
                          value: $key,
                        }),
                      )}
                      isRequired
                      error={errors?.owner_location_country}
                    />
                    <InputField
                      inputWrapperClass={s.inputHeight}
                      name="owner_location_postcode"
                      label={`${t('Index', { ns: 'other' })}:`}
                      placeholder={t('Enter index', { ns: 'other' })}
                      isShadow
                      className={s.input}
                      error={!!errors.owner_location_postcode}
                      touched={!!touched.owner_location_postcode}
                      isRequired
                      disabled={
                        domainsContacts?.owner_location_postcode?.$readonly === 'yes'
                      }
                    />
                    <InputField
                      inputWrapperClass={s.inputHeight}
                      name="owner_location_state"
                      label={`${t('Region', { ns: 'other' })}:`}
                      placeholder={t('Enter region', { ns: 'other' })}
                      isShadow
                      className={s.input}
                      error={!!errors.owner_location_state}
                      touched={!!touched.owner_location_state}
                      isRequired
                      disabled={
                        domainsContacts?.owner_location_state?.$readonly === 'yes'
                      }
                    />
                    <InputField
                      inputWrapperClass={s.inputHeight}
                      name="owner_location_city"
                      label={`${t('City', { ns: 'other' })}:`}
                      placeholder={t('Enter city', { ns: 'other' })}
                      isShadow
                      className={s.input}
                      error={!!errors.owner_location_city}
                      touched={!!touched.owner_location_city}
                      isRequired
                      disabled={domainsContacts?.owner_location_city?.$readonly === 'yes'}
                    />
                    <InputField
                      inputWrapperClass={s.inputHeight}
                      name="owner_location_address"
                      label={`${t('The address', { ns: 'other' })}:`}
                      placeholder={t('Enter address', { ns: 'other' })}
                      isShadow
                      className={s.input}
                      error={!!errors.owner_location_address}
                      touched={!!touched.owner_location_address}
                      isRequired
                      disabled={
                        domainsContacts?.owner_location_address?.$readonly === 'yes'
                      }
                    />
                  </div>
                </div>
              </div>

              {/*============================================ADMIN============================================*/}

              <div className={s.category_block}>
                <button
                  onClick={() => setIsOpenAdmin(!isOpenAdmin)}
                  type="button"
                  className={s.titleBlock}
                >
                  <h2 className={s.category_title}>{t('Administrative contact')}</h2>
                  <Shevron className={cn(s.shevronIcon, { [s.isOpen]: isOpenAdmin })} />
                </button>
                <div className={s.useFirstCheck}>
                  <CheckBox
                    initialState={values.admin_contact_use_first === 'on'}
                    setValue={item => {
                      setFieldValue('admin_contact_use_first', item ? 'on' : 'off')
                      if (!item) {
                        setIsOpenAdmin(true)
                      }
                    }}
                    className={s.checkbox}
                    error={!!errors.admin_contact_use_first}
                  />
                  <span>{t('Use "Contact Owner"')}</span>
                </div>
                <div
                  className={cn(s.ownerForm, {
                    [s.isOpen]: isOpenAdmin && values.admin_contact_use_first === 'off',
                  })}
                >
                  <div className={s.formBlock}>
                    <div className={s.formFieldsBlock}>
                      <Select
                        placeholder={t('Not chosen', { ns: 'other' })}
                        label={`${t('Use contact')}:`}
                        value={values.admin_contact_select}
                        getElement={item => onAdminContactChange(item)}
                        isShadow
                        className={s.select}
                        itemsList={domainsContacts?.admin_contact_select_list?.map(
                          ({ $key, $ }) => ({
                            label: t(`${$.trim()}`),
                            value: $key,
                          }),
                        )}
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="admin_name"
                        label={`${t('Profile name')}:`}
                        placeholder={t('Enter data', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.admin_name}
                        touched={!!touched.admin_name}
                        isRequired
                        disabled={domainsContacts?.admin_name?.$readonly === 'yes'}
                      />
                      <Select
                        placeholder={t('Not chosen', { ns: 'other' })}
                        label={`${t('Contact type')}:`}
                        value={values.admin_profiletype}
                        getElement={item => setFieldValue('admin_profiletype', item)}
                        isShadow
                        className={s.select}
                        itemsList={domainsContacts?.admin_profiletype_list?.map(
                          ({ $key, $ }) => ({
                            label: t(`${$.trim()}`),
                            value: $key,
                          }),
                        )}
                      />
                    </div>
                  </div>

                  <div className={s.formBlock}>
                    <div className={s.formBlockTitle}>{t('Contact person details')}</div>
                    <div className={s.formFieldsBlock}>
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="admin_firstname_locale"
                        label={`${t('Name', { ns: 'other' })}:`}
                        placeholder={t('Enter name', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.admin_firstname_locale}
                        touched={!!touched.admin_firstname_locale}
                        isRequired
                        disabled={
                          domainsContacts?.admin_firstname_locale?.$readonly === 'yes'
                        }
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="admin_firstname"
                        label={`${t('Name', { ns: 'other' })} (EN):`}
                        placeholder={t('Enter name', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.admin_firstname}
                        touched={!!touched.admin_firstname}
                        isRequired
                        disabled={domainsContacts?.admin_firstname?.$readonly === 'yes'}
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="admin_lastname_locale"
                        label={`${t('Surname', { ns: 'other' })}:`}
                        placeholder={t('Enter surname', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.admin_lastname_locale}
                        touched={!!touched.admin_lastname_locale}
                        isRequired
                        disabled={
                          domainsContacts?.admin_lastname_locale?.$readonly === 'yes'
                        }
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="admin_lastname"
                        label={`${t('Surname', { ns: 'other' })} (EN):`}
                        placeholder={t('Enter surname', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.admin_lastname}
                        touched={!!touched.admin_lastname}
                        isRequired
                        disabled={domainsContacts?.admin_lastname?.$readonly === 'yes'}
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="admin_middlename_locale"
                        label={`${t('Middle name', { ns: 'other' })}:`}
                        placeholder={t('Enter middle name', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.admin_middlename_locale}
                        touched={!!touched.admin_middlename_locale}
                        disabled={
                          domainsContacts?.admin_middlename_locale?.$readonly === 'yes'
                        }
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="admin_middlename"
                        label={`${t('Middle name', { ns: 'other' })} (EN):`}
                        placeholder={t('Enter middle name', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.admin_middlename}
                        touched={!!touched.admin_middlename}
                        disabled={domainsContacts?.admin_middlename?.$readonly === 'yes'}
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        type="email"
                        name="admin_email"
                        label={`${t('Email')}:`}
                        placeholder={t('Enter email', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.admin_email}
                        touched={!!touched.admin_email}
                        isRequired
                        disabled={domainsContacts?.admin_email?.$readonly === 'yes'}
                      />
                      <CustomPhoneInput
                        containerClass={s.phoneInputContainer}
                        inputClass={s.phoneInputClass}
                        value={values.admin_phone}
                        wrapperClass={s.phoneInput}
                        labelClass={s.phoneInputLabel}
                        label={`${t('Phone', { ns: 'other' })}:`}
                        handleBlur={handleBlur}
                        setFieldValue={setFieldValue}
                        name="admin_phone"
                        disabled={domainsContacts?.admin_email?.$readonly === 'yes'}
                      />
                    </div>
                  </div>

                  <div className={s.formBlock}>
                    <div className={s.formBlockTitle}>{t('Contact address')}</div>
                    <div className={s.formFieldsBlock}>
                      <Select
                        placeholder={t('Not chosen', { ns: 'other' })}
                        label={`${t('The country', { ns: 'other' })}:`}
                        value={values.admin_location_country}
                        getElement={item => setFieldValue('admin_location_country', item)}
                        isShadow
                        className={s.select}
                        itemsList={domainsContacts?.admin_location_country_list?.map(
                          ({ $key, $, $image }) => ({
                            label: (
                              <div className={s.countrySelectItem}>
                                {$key !== 'null' && (
                                  <img src={`${BASE_URL}${$image}`} alt="flag" />
                                )}
                                {t(`${$.trim()}`)}
                              </div>
                            ),
                            value: $key,
                          }),
                        )}
                        isRequired
                        error={errors?.admin_location_country}
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="admin_location_postcode"
                        label={`${t('Index', { ns: 'other' })}:`}
                        placeholder={t('Enter index', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.admin_location_postcode}
                        touched={!!touched.admin_location_postcode}
                        isRequired
                        disabled={
                          domainsContacts?.admin_location_postcode?.$readonly === 'yes'
                        }
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="admin_location_state"
                        label={`${t('Region', { ns: 'other' })}:`}
                        placeholder={t('Enter region', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.admin_location_state}
                        touched={!!touched.admin_location_state}
                        isRequired
                        disabled={
                          domainsContacts?.admin_location_state?.$readonly === 'yes'
                        }
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="admin_location_city"
                        label={`${t('City', { ns: 'other' })}:`}
                        placeholder={t('Enter city', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.admin_location_city}
                        touched={!!touched.admin_location_city}
                        isRequired
                        disabled={
                          domainsContacts?.admin_location_city?.$readonly === 'yes'
                        }
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="admin_location_address"
                        label={`${t('The address', { ns: 'other' })}:`}
                        placeholder={t('Enter address', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.admin_location_address}
                        touched={!!touched.admin_location_address}
                        isRequired
                        disabled={
                          domainsContacts?.admin_location_address?.$readonly === 'yes'
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/*============================================TECH============================================*/}

              <div className={s.category_block}>
                <button
                  onClick={() => setIsOpenTech(!isOpenTech)}
                  type="button"
                  className={s.titleBlock}
                >
                  <h2 className={s.category_title}>{t('Technical contact')}</h2>
                  <Shevron className={cn(s.shevronIcon, { [s.isOpen]: isOpenTech })} />
                </button>
                <div className={s.useFirstCheck}>
                  <CheckBox
                    initialState={values.tech_contact_use_first === 'on'}
                    setValue={item => {
                      setFieldValue('tech_contact_use_first', item ? 'on' : 'off')
                      if (!item) {
                        setIsOpenTech(true)
                      }
                    }}
                    className={s.checkbox}
                    error={!!errors.tech_contact_use_first}
                  />
                  <span>{t('Use "Contact Owner"')}</span>
                </div>
                <div
                  className={cn(s.ownerForm, {
                    [s.isOpen]: isOpenTech && values.tech_contact_use_first === 'off',
                  })}
                >
                  <div className={s.formBlock}>
                    <div className={s.formFieldsBlock}>
                      <Select
                        placeholder={t('Not chosen', { ns: 'other' })}
                        label={`${t('Use contact')}:`}
                        value={values.tech_contact_select}
                        getElement={item => onTechContactChange(item)}
                        isShadow
                        className={s.select}
                        itemsList={domainsContacts?.tech_contact_select_list?.map(
                          ({ $key, $ }) => ({
                            label: t(`${$.trim()}`),
                            value: $key,
                          }),
                        )}
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="tech_name"
                        label={`${t('Profile name')}:`}
                        placeholder={t('Enter data', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.tech_name}
                        touched={!!touched.tech_name}
                        isRequired
                        disabled={domainsContacts?.tech_name?.$readonly === 'yes'}
                      />
                      <Select
                        placeholder={t('Not chosen', { ns: 'other' })}
                        label={`${t('Contact type')}:`}
                        value={values.tech_profiletype}
                        getElement={item => setFieldValue('tech_profiletype', item)}
                        isShadow
                        className={s.select}
                        itemsList={domainsContacts?.tech_profiletype_list?.map(
                          ({ $key, $ }) => ({
                            label: t(`${$.trim()}`),
                            value: $key,
                          }),
                        )}
                      />
                    </div>
                  </div>

                  <div className={s.formBlock}>
                    <div className={s.formBlockTitle}>{t('Contact person details')}</div>
                    <div className={s.formFieldsBlock}>
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="tech_firstname_locale"
                        label={`${t('Name', { ns: 'other' })}:`}
                        placeholder={t('Enter name', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.tech_firstname_locale}
                        touched={!!touched.tech_firstname_locale}
                        isRequired
                        disabled={
                          domainsContacts?.tech_firstname_locale?.$readonly === 'yes'
                        }
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="tech_firstname"
                        label={`${t('Name', { ns: 'other' })} (EN):`}
                        placeholder={t('Enter name', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.tech_firstname}
                        touched={!!touched.tech_firstname}
                        isRequired
                        disabled={domainsContacts?.tech_firstname?.$readonly === 'yes'}
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="tech_lastname_locale"
                        label={`${t('Surname', { ns: 'other' })}:`}
                        placeholder={t('Enter surname', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.tech_lastname_locale}
                        touched={!!touched.tech_lastname_locale}
                        isRequired
                        disabled={
                          domainsContacts?.tech_lastname_locale?.$readonly === 'yes'
                        }
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="tech_lastname"
                        label={`${t('Surname', { ns: 'other' })} (EN):`}
                        placeholder={t('Enter surname', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.tech_lastname}
                        touched={!!touched.tech_lastname}
                        isRequired
                        disabled={domainsContacts?.tech_lastname?.$readonly === 'yes'}
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="tech_middlename_locale"
                        label={`${t('Middle name', { ns: 'other' })}:`}
                        placeholder={t('Enter middle name', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.tech_middlename_locale}
                        touched={!!touched.tech_middlename_locale}
                        disabled={
                          domainsContacts?.tech_middlename_locale?.$readonly === 'yes'
                        }
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="tech_middlename"
                        label={`${t('Middle name', { ns: 'other' })} (EN):`}
                        placeholder={t('Enter middle name', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.tech_middlename}
                        touched={!!touched.tech_middlename}
                        disabled={domainsContacts?.tech_middlename?.$readonly === 'yes'}
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        type="email"
                        name="tech_email"
                        label={`${t('Email')}:`}
                        placeholder={t('Enter email', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.tech_email}
                        touched={!!touched.tech_email}
                        isRequired
                        disabled={domainsContacts?.tech_email?.$readonly === 'yes'}
                      />
                      <CustomPhoneInput
                        containerClass={s.phoneInputContainer}
                        inputClass={s.phoneInputClass}
                        value={values.tech_phone}
                        wrapperClass={s.phoneInput}
                        labelClass={s.phoneInputLabel}
                        label={`${t('Phone', { ns: 'other' })}:`}
                        handleBlur={handleBlur}
                        setFieldValue={setFieldValue}
                        name="tech_phone"
                        disabled={domainsContacts?.tech_email?.$readonly === 'yes'}
                      />
                    </div>
                  </div>

                  <div className={s.formBlock}>
                    <div className={s.formBlockTitle}>{t('Contact address')}</div>
                    <div className={s.formFieldsBlock}>
                      <Select
                        placeholder={t('Not chosen', { ns: 'other' })}
                        label={`${t('The country', { ns: 'other' })}:`}
                        value={values.tech_location_country}
                        getElement={item => setFieldValue('tech_location_country', item)}
                        isShadow
                        className={s.select}
                        itemsList={domainsContacts?.tech_location_country_list?.map(
                          ({ $key, $, $image }) => ({
                            label: (
                              <div className={s.countrySelectItem}>
                                {$key !== 'null' && (
                                  <img src={`${BASE_URL}${$image}`} alt="flag" />
                                )}
                                {t(`${$.trim()}`)}
                              </div>
                            ),
                            value: $key,
                          }),
                        )}
                        isRequired
                        error={errors?.tech_location_country}
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="tech_location_postcode"
                        label={`${t('Index', { ns: 'other' })}:`}
                        placeholder={t('Enter index', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.tech_location_postcode}
                        touched={!!touched.tech_location_postcode}
                        isRequired
                        disabled={
                          domainsContacts?.tech_location_postcode?.$readonly === 'yes'
                        }
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="tech_location_state"
                        label={`${t('Region', { ns: 'other' })}:`}
                        placeholder={t('Enter region', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.tech_location_state}
                        touched={!!touched.tech_location_state}
                        isRequired
                        disabled={
                          domainsContacts?.tech_location_state?.$readonly === 'yes'
                        }
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="tech_location_city"
                        label={`${t('City', { ns: 'other' })}:`}
                        placeholder={t('Enter city', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.tech_location_city}
                        touched={!!touched.tech_location_city}
                        isRequired
                        disabled={
                          domainsContacts?.tech_location_city?.$readonly === 'yes'
                        }
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="tech_location_address"
                        label={`${t('The address', { ns: 'other' })}:`}
                        placeholder={t('Enter address', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.tech_location_address}
                        touched={!!touched.tech_location_address}
                        isRequired
                        disabled={
                          domainsContacts?.tech_location_address?.$readonly === 'yes'
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/*============================================BILL============================================*/}

              <div className={s.category_block}>
                <button
                  onClick={() => setIsOpenBill(!isOpenBill)}
                  type="button"
                  className={s.titleBlock}
                >
                  <h2 className={s.category_title}>{t('Financial contact')}</h2>
                  <Shevron className={cn(s.shevronIcon, { [s.isOpen]: isOpenBill })} />
                </button>
                <div className={s.useFirstCheck}>
                  <CheckBox
                    initialState={values.bill_contact_use_first === 'on'}
                    setValue={item => {
                      setFieldValue('bill_contact_use_first', item ? 'on' : 'off')
                      if (!item) {
                        setIsOpenBill(true)
                      }
                    }}
                    className={s.checkbox}
                    error={!!errors.bill_contact_use_first}
                  />
                  <span>{t('Use "Contact Owner"')}</span>
                </div>
                <div
                  className={cn(s.ownerForm, {
                    [s.isOpen]: isOpenBill && values.bill_contact_use_first === 'off',
                  })}
                >
                  <div className={s.formBlock}>
                    <div className={s.formFieldsBlock}>
                      <Select
                        placeholder={t('Not chosen', { ns: 'other' })}
                        label={`${t('Use contact')}:`}
                        value={values.bill_contact_select}
                        getElement={item => onBillContactChange(item)}
                        isShadow
                        className={s.select}
                        itemsList={domainsContacts?.bill_contact_select_list?.map(
                          ({ $key, $ }) => ({
                            label: t(`${$.trim()}`),
                            value: $key,
                          }),
                        )}
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="bill_name"
                        label={`${t('Profile name')}:`}
                        placeholder={t('Enter data', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.bill_name}
                        touched={!!touched.bill_name}
                        isRequired
                        disabled={domainsContacts?.bill_name?.$readonly === 'yes'}
                      />
                      <Select
                        placeholder={t('Not chosen', { ns: 'other' })}
                        label={`${t('Contact type')}:`}
                        value={values.bill_profiletype}
                        getElement={item => setFieldValue('bill_profiletype', item)}
                        isShadow
                        className={s.select}
                        itemsList={domainsContacts?.bill_profiletype_list?.map(
                          ({ $key, $ }) => ({
                            label: t(`${$.trim()}`),
                            value: $key,
                          }),
                        )}
                      />
                    </div>
                  </div>

                  <div className={s.formBlock}>
                    <div className={s.formBlockTitle}>{t('Contact person details')}</div>
                    <div className={s.formFieldsBlock}>
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="bill_firstname_locale"
                        label={`${t('Name', { ns: 'other' })}:`}
                        placeholder={t('Enter name', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.bill_firstname_locale}
                        touched={!!touched.bill_firstname_locale}
                        isRequired
                        disabled={
                          domainsContacts?.bill_firstname_locale?.$readonly === 'yes'
                        }
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="bill_firstname"
                        label={`${t('Name', { ns: 'other' })} (EN):`}
                        placeholder={t('Enter name', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.bill_firstname}
                        touched={!!touched.bill_firstname}
                        isRequired
                        disabled={domainsContacts?.bill_firstname?.$readonly === 'yes'}
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="bill_lastname_locale"
                        label={`${t('Surname', { ns: 'other' })}:`}
                        placeholder={t('Enter surname', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.bill_lastname_locale}
                        touched={!!touched.bill_lastname_locale}
                        isRequired
                        disabled={
                          domainsContacts?.bill_lastname_locale?.$readonly === 'yes'
                        }
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="bill_lastname"
                        label={`${t('Surname', { ns: 'other' })} (EN):`}
                        placeholder={t('Enter surname', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.bill_lastname}
                        touched={!!touched.bill_lastname}
                        isRequired
                        disabled={domainsContacts?.bill_lastname?.$readonly === 'yes'}
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="bill_middlename_locale"
                        label={`${t('Middle name', { ns: 'other' })}:`}
                        placeholder={t('Enter middle name', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.bill_middlename_locale}
                        touched={!!touched.bill_middlename_locale}
                        disabled={
                          domainsContacts?.bill_middlename_locale?.$readonly === 'yes'
                        }
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="bill_middlename"
                        label={`${t('Middle name', { ns: 'other' })} (EN):`}
                        placeholder={t('Enter middle name', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.bill_middlename}
                        touched={!!touched.bill_middlename}
                        disabled={domainsContacts?.bill_middlename?.$readonly === 'yes'}
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        type="email"
                        name="bill_email"
                        label={`${t('Email')}:`}
                        placeholder={t('Enter email', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.bill_email}
                        touched={!!touched.bill_email}
                        isRequired
                        disabled={domainsContacts?.bill_email?.$readonly === 'yes'}
                      />
                      <CustomPhoneInput
                        containerClass={s.phoneInputContainer}
                        inputClass={s.phoneInputClass}
                        value={values.bill_phone}
                        wrapperClass={s.phoneInput}
                        labelClass={s.phoneInputLabel}
                        label={`${t('Phone', { ns: 'other' })}:`}
                        handleBlur={handleBlur}
                        setFieldValue={setFieldValue}
                        name="bill_phone"
                        disabled={domainsContacts?.bill_email?.$readonly === 'yes'}
                      />
                    </div>
                  </div>

                  <div className={s.formBlock}>
                    <div className={s.formBlockTitle}>{t('Contact address')}</div>
                    <div className={s.formFieldsBlock}>
                      <Select
                        placeholder={t('Not chosen', { ns: 'other' })}
                        label={`${t('The country', { ns: 'other' })}:`}
                        value={values.bill_location_country}
                        getElement={item => setFieldValue('bill_location_country', item)}
                        isShadow
                        className={s.select}
                        itemsList={domainsContacts?.bill_location_country_list?.map(
                          ({ $key, $, $image }) => ({
                            label: (
                              <div className={s.countrySelectItem}>
                                {$key !== 'null' && (
                                  <img src={`${BASE_URL}${$image}`} alt="flag" />
                                )}
                                {t(`${$.trim()}`)}
                              </div>
                            ),
                            value: $key,
                          }),
                        )}
                        isRequired
                        error={errors?.bill_location_country}
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="bill_location_postcode"
                        label={`${t('Index', { ns: 'other' })}:`}
                        placeholder={t('Enter index', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.bill_location_postcode}
                        touched={!!touched.bill_location_postcode}
                        isRequired
                        disabled={
                          domainsContacts?.bill_location_postcode?.$readonly === 'yes'
                        }
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="bill_location_state"
                        label={`${t('Region', { ns: 'other' })}:`}
                        placeholder={t('Enter region', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.bill_location_state}
                        touched={!!touched.bill_location_state}
                        isRequired
                        disabled={
                          domainsContacts?.bill_location_state?.$readonly === 'yes'
                        }
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="bill_location_city"
                        label={`${t('City', { ns: 'other' })}:`}
                        placeholder={t('Enter city', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.bill_location_city}
                        touched={!!touched.bill_location_city}
                        isRequired
                        disabled={
                          domainsContacts?.bill_location_city?.$readonly === 'yes'
                        }
                      />
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="bill_location_address"
                        label={`${t('The address', { ns: 'other' })}:`}
                        placeholder={t('Enter address', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.bill_location_address}
                        touched={!!touched.bill_location_address}
                        isRequired
                        disabled={
                          domainsContacts?.bill_location_address?.$readonly === 'yes'
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={s.btnBlock}>
                <Button
                  className={s.saveBtn}
                  isShadow
                  size="medium"
                  label={t('Proceed', { ns: 'other' })}
                  type="submit"
                />
                <button
                  onClick={() => navigate(route.DOMAINS)}
                  type="button"
                  className={s.cancel}
                >
                  {t('Cancel', { ns: 'other' })}
                </button>
              </div>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
