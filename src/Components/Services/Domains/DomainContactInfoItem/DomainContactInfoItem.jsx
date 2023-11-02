import { useEffect, useImperativeHandle, useState } from 'react'
import { InputField, CustomPhoneInput, Select, CheckBox, Icon } from '@components'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { FormikProvider, useFormik } from 'formik'
import {
  EMAIL_SPECIAL_CHARACTERS_REGEX,
  CYRILLIC_ALPHABET_PROHIBITED,
  LATIN_NUMBER_REGEX,
  LATIN_REGEX,
} from '@utils/constants'
import { useDispatch } from 'react-redux'
import { domainsOperations } from '@redux'
import s from './DomainContactInfoItem.module.scss'
import * as Yup from 'yup'
import 'yup-phone'

export default function Component(props) {
  const {
    onChange,
    refId,
    formType,
    domainsContacts,
    setDomainsContacts,
    domainInfo,
    setPayersInfo,
    payersInfo,
    signal,
    setIsLoading,
  } = props

  const dispatch = useDispatch()
  const { t } = useTranslation([
    'domains',
    'other',
    'trusted_users',
    'payers',
    'auth',
    'user_settings',
  ])

  const owner = formType === 'owner'

  // fields variables //
  const contact_use_first = `${formType}_contact_use_first`
  const name = `${formType}_name`
  const contact_select = `${formType}_contact_select`
  const contact_select_list = `${formType}_contact_select_list`
  const profiletype = `${formType}_profiletype`
  const profiletype_list = `${formType}_profiletype_list`
  const email = `${formType}_email`
  const phone = `${formType}_phone`
  const phone_country = `${formType}_phone_country`
  const privateForm = `${formType}_private`
  const firstname = `${formType}_firstname`
  const firstname_locale = `${formType}_firstname_locale`
  const lastname = `${formType}_lastname`
  const lastname_locale = `${formType}_lastname_locale`
  const middlename = `${formType}_middlename`
  const middlename_locale = `${formType}_middlename_locale`
  const location_country = `${formType}_location_country`
  const location_country_list = `${formType}_location_country_list`
  const location_postcode = `${formType}_location_postcode`
  const location_state = `${formType}_location_state`
  const location_city = `${formType}_location_city`
  const location_address = `${formType}_location_address`
  const company = `${formType}_company`
  const company_locale = `${formType}_company_locale`

  useEffect(() => {
    if (domainsContacts) {
      setPayersInfo(p => {
        return {
          ...p,
          [contact_use_first]: domainsContacts[contact_use_first],
          [contact_select]: domainsContacts[contact_select],
          [profiletype]: domainsContacts[profiletype],
        }
      })
    }
  }, [domainsContacts])

  const [isOpen, setIsOpen] = useState(owner)
  const [profileTypeState, setProfiletypeState] = useState(domainsContacts[profiletype])
  const [countryCode, setCountryCode] = useState(null)

  useEffect(() => {
    if (
      domainsContacts &&
      domainsContacts[location_country_list] &&
      domainsContacts[phone_country]
    ) {
      const findCountry = domainsContacts[location_country_list]?.find(
        e => e?.$key === domainsContacts[phone_country],
      )
      const code = findCountry?.$image?.slice(-6, -4)?.toLowerCase()
      setCountryCode(code)
    }
  }, [domainsContacts])

  const yupValidation = {
    name: Yup.string().required(t('Is a required field', { ns: 'other' })),
    email: Yup.string()
      .matches(
        EMAIL_SPECIAL_CHARACTERS_REGEX,
        t('warnings.special_characters', { ns: 'auth' }),
      )
      .matches(
        CYRILLIC_ALPHABET_PROHIBITED,
        t('warnings.cyrillic_prohibited', { ns: 'auth' }),
      )

      .email(t('warnings.invalid_email', { ns: 'auth' }))
      .required(t('warnings.email_required', { ns: 'auth' })),
    company: Yup.string().required(t('Is a required field', { ns: 'other' })),
    firstname: Yup.string()
      .matches(LATIN_REGEX, t('Name can only contain Latin letters'))
      .required(t('Is a required field', { ns: 'other' })),
    firstname_locale: Yup.string().required(t('Is a required field', { ns: 'other' })),
    lastname: Yup.string()
      .matches(LATIN_REGEX, t('Lastname can only contain Latin letters'))
      .required(t('Is a required field', { ns: 'other' })),

    lastname_locale: Yup.string().required(t('Is a required field', { ns: 'other' })),
    phone: Yup.string().phone(
      countryCode,
      false,
      t('Must be a valid phone number', { ns: 'user_settings' }),
    ),
    location_country: Yup.string()
      .notOneOf(['null'], t('Is a required field', { ns: 'other' }))
      .required(t('Is a required field', { ns: 'other' })),
    location_postcode: Yup.string()
      .matches(LATIN_NUMBER_REGEX, t('Lastname can only contain Latin letters'))
      .required(t('Is a required field', { ns: 'other' })),
    location_state: Yup.string().required(t('Is a required field', { ns: 'other' })),
    location_city: Yup.string().required(t('Is a required field', { ns: 'other' })),
    location_address: Yup.string().required(t('Is a required field', { ns: 'other' })),
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      [contact_use_first]: owner ? undefined : domainsContacts[contact_use_first],
      [company]: domainsContacts[company] || '',
      [company_locale]: domainsContacts[company_locale] || '',
      [contact_select]: domainsContacts[contact_select] || '',
      [name]: domainsContacts[name]?.$ || '',
      [profiletype]: domainsContacts[profiletype] || '',
      [email]: domainsContacts[email]?.$ || '',
      [phone]: domainsContacts[phone] || '',
      [privateForm]: domainsContacts[privateForm] || 'off',
      [firstname]: domainsContacts[firstname]?.$ || '',
      [firstname_locale]: domainsContacts[firstname_locale]?.$ || '',
      [lastname]: domainsContacts[lastname]?.$ || '',
      [lastname_locale]: domainsContacts[lastname_locale]?.$ || '',
      [middlename]: domainsContacts[middlename]?.$ || '',
      [middlename_locale]: domainsContacts[middlename_locale]?.$ || '',
      [location_country]: domainsContacts[location_country] || '',
      [location_postcode]: domainsContacts[location_postcode]?.$ || '',
      [location_state]: domainsContacts[location_state]?.$ || '',
      [location_city]: domainsContacts[location_city]?.$ || '',
      [location_address]: domainsContacts[location_address]?.$ || '',
    },
    validationSchema: Yup.object().shape({
      [name]: owner
        ? yupValidation.name
        : Yup.string().when(contact_use_first, {
            is: 'off',
            then: yupValidation.name,
          }),

      [email]: owner
        ? yupValidation.email
        : Yup.string().when(contact_use_first, {
            is: 'off',
            then: yupValidation.email,
          }),
      [company]:
        profileTypeState === '2' || profileTypeState === '3'
          ? owner
            ? yupValidation?.company
            : Yup.string().when(contact_use_first, {
                is: 'off',
                then: yupValidation?.company,
              })
          : null,
      [company_locale]:
        profileTypeState === '2' || profileTypeState === '3'
          ? owner
            ? yupValidation?.company
            : Yup.string().when(contact_use_first, {
                is: 'off',
                then: yupValidation?.company,
              })
          : null,
      [firstname]: owner
        ? yupValidation.firstname
        : Yup.string().when(contact_use_first, {
            is: 'off',
            then: yupValidation.firstname,
          }),
      [firstname_locale]: owner
        ? yupValidation.firstname_locale
        : Yup.string().when(contact_use_first, {
            is: 'off',
            then: yupValidation.firstname_locale,
          }),

      [lastname]: owner
        ? yupValidation.lastname
        : Yup.string().when(contact_use_first, {
            is: 'off',
            then: yupValidation.lastname,
          }),
      [lastname_locale]: owner
        ? yupValidation.lastname_locale
        : Yup.string().when(contact_use_first, {
            is: 'off',
            then: yupValidation.lastname_locale,
          }),

      [phone]: owner
        ? yupValidation.phone
        : Yup.string().when(contact_use_first, {
            is: 'off',
            then: yupValidation.phone,
          }),

      [location_country]: owner
        ? yupValidation.location_country
        : Yup.string().when(contact_use_first, {
            is: 'off',
            then: yupValidation.location_country,
          }),
      [location_postcode]: owner
        ? yupValidation.location_postcode
        : Yup.string().when(contact_use_first, {
            is: 'off',
            then: yupValidation.location_postcode,
          }),

      [location_state]: owner
        ? yupValidation.location_state
        : Yup.string().when(contact_use_first, {
            is: 'off',
            then: yupValidation.location_state,
          }),
      [location_city]: owner
        ? yupValidation.location_city
        : Yup.string().when(contact_use_first, {
            is: 'off',
            then: yupValidation.location_city,
          }),
      [location_address]: owner
        ? yupValidation.location_address
        : Yup.string().when(contact_use_first, {
            is: 'off',
            then: yupValidation.location_address,
          }),
    }),
    onSubmit: () => {
      watchForm()
    },
  })

  const { values, setFieldValue, errors, touched, handleBlur, setFieldError } = formik

  useImperativeHandle(refId, () => ({
    Submit: async () => {
      await formik.submitForm()
    },
  }))

  function watchForm() {
    if (onChange) {
      onChange({
        values: formik.values,
        validated: formik.isSubmitting ? Object.keys(formik.errors).length === 0 : false,
      })
    }
  }

  const onContactChange = item => {
    const body = {
      ...domainInfo,
      [contact_select]: item,
      [contact_use_first]: values[contact_use_first],
    }

    if (payersInfo) {
      for (const [key, value] of Object.entries(payersInfo)) {
        if (key !== contact_select && contact_select !== contact_use_first) {
          body[key] = value
        }
      }
    }

    dispatch(
      domainsOperations.getDomainsContacts({
        setDomainsContacts,
        body,
        signal,
        setIsLoading,
      }),
    )
    setFieldValue(contact_select, item)
  }

  const openHandler = () => {
    setIsOpen(!isOpen)
  }

  const useOwnerDataHandler = () => {
    setFieldValue(contact_use_first, values[contact_use_first] === 'on' ? 'off' : 'on')
    setPayersInfo(p => {
      return {
        ...p,
        [contact_use_first]: values[contact_use_first] === 'on' ? 'off' : 'on',
      }
    })
    if (values[contact_use_first] !== 'on') {
      setIsOpen(false)
    } else {
      setIsOpen(true)
    }
  }

  const validateENFields = (e, name) => {
    const value = e.target.value
    if (value.match(LATIN_NUMBER_REGEX)) {
      setFieldValue(name, value)
    } else {
      setFieldError(name, t('latin_only'))
      touched[name] = true
    }
  }

  return (
    <FormikProvider value={formik}>
      <form ref={refId}>
        <button
          disabled={!owner && values[contact_use_first] === 'on'}
          onClick={openHandler}
          type="button"
          className={s.titleBlock}
        >
          <h2 className={s.category_title}>{t(`${formType}_contact`)}</h2>
          {(owner || values[contact_use_first] === 'off') && (
            <Icon name="Shevron" className={cn(s.shevronIcon, { [s.isOpen]: isOpen })} />
          )}
        </button>
        {!owner && (
          <div className={s.useFirstCheck}>
            <CheckBox
              value={values[contact_use_first] === 'on'}
              onClick={useOwnerDataHandler}
              className={s.checkbox}
              error={!!errors[contact_use_first]}
            />
            <span>{t('Use "Contact Owner"')}</span>
          </div>
        )}
        <div className={cn(s.ownerForm, { [s.isOpen]: isOpen })}>
          <div className={s.formBlock}>
            <div className={s.formFieldsBlock}>
              <Select
                placeholder={t('Not chosen', { ns: 'other' })}
                label={`${t('Use contact')}:`}
                value={values[contact_select]}
                getElement={onContactChange}
                isShadow
                className={s.select}
                itemsList={domainsContacts[contact_select_list]?.map(({ $key, $ }) => ({
                  label: t(`${$.trim()}`, { ns: 'payers' }),
                  value: $key,
                }))}
              />
              <InputField
                inputWrapperClass={s.inputHeight}
                name={name}
                label={`${t('Profile name')}:`}
                placeholder={t('Enter data', { ns: 'other' })}
                isShadow
                className={s.input}
                error={!!errors[name]}
                touched={!!touched[name]}
                isRequired
                disabled={domainsContacts[name]?.$readonly === 'yes'}
              />
              <Select
                placeholder={t('Not chosen', { ns: 'other' })}
                label={`${t('Contact type')}:`}
                value={values[profiletype]}
                getElement={item => {
                  setFieldValue(profiletype, item)
                  setProfiletypeState(item)
                }}
                isShadow
                className={s.select}
                itemsList={domainsContacts[profiletype_list]?.map(({ $key, $ }) => ({
                  label: t(`${$.trim()}`, { ns: 'payers' }),
                  value: $key,
                }))}
              />

              {values[profiletype] === '3' || values[profiletype] === '2' ? (
                <>
                  <InputField
                    inputWrapperClass={s.inputHeight}
                    name={company}
                    label={`${t('Company name', { ns: 'payers' })} (EN):`}
                    placeholder={t('Enter data', { ns: 'other' })}
                    isShadow
                    className={s.input}
                    error={!!errors[company]}
                    touched={!!touched[company]}
                    isRequired
                    disabled={domainsContacts[company]?.$readonly === 'yes'}
                    onChange={e => validateENFields(e, company)}
                  />
                  <InputField
                    inputWrapperClass={s.inputHeight}
                    name={company_locale}
                    label={`${t('Company name', { ns: 'payers' })}:`}
                    placeholder={t('Enter data', { ns: 'other' })}
                    isShadow
                    className={s.input}
                    error={!!errors[company_locale]}
                    touched={!!touched[company_locale]}
                    isRequired
                    disabled={domainsContacts[company_locale]?.$readonly === 'yes'}
                  />
                </>
              ) : null}
            </div>
          </div>

          <div className={s.formBlock}>
            <div className={s.formBlockTitle}>{t('Contact person details')}</div>
            <div className={s.formFieldsBlock}>
              <InputField
                inputWrapperClass={s.inputHeight}
                name={firstname_locale}
                label={`${t('Name', { ns: 'other' })}:`}
                placeholder={t('Enter name', { ns: 'other' })}
                isShadow
                className={s.input}
                error={!!errors[firstname_locale]}
                touched={!!touched[firstname_locale]}
                isRequired
                disabled={domainsContacts[firstname_locale]?.$readonly === 'yes'}
              />
              <InputField
                inputWrapperClass={s.inputHeight}
                name={firstname}
                label={`${t('Name', { ns: 'other' })} (EN):`}
                placeholder={t('Enter name', { ns: 'other' })}
                isShadow
                className={s.input}
                error={!!errors[firstname]}
                touched={!!touched[firstname]}
                isRequired
                disabled={domainsContacts[firstname]?.$readonly === 'yes'}
                onChange={e => validateENFields(e, firstname)}
              />
              <InputField
                inputWrapperClass={s.inputHeight}
                name={lastname_locale}
                label={`${t('Surname', { ns: 'other' })}:`}
                placeholder={t('Enter surname', { ns: 'other' })}
                isShadow
                className={s.input}
                error={!!errors[lastname_locale]}
                touched={!!touched[lastname_locale]}
                isRequired
                disabled={domainsContacts[lastname_locale]?.$readonly === 'yes'}
              />
              <InputField
                inputWrapperClass={s.inputHeight}
                name={lastname}
                label={`${t('Surname', { ns: 'other' })} (EN):`}
                placeholder={t('Enter surname', { ns: 'other' })}
                isShadow
                className={s.input}
                error={!!errors[lastname]}
                touched={!!touched[lastname]}
                isRequired
                disabled={domainsContacts[lastname]?.$readonly === 'yes'}
                onChange={e => validateENFields(e, lastname)}
              />
              <InputField
                inputWrapperClass={s.inputHeight}
                name={middlename_locale}
                label={`${t('Middle name', { ns: 'other' })}:`}
                placeholder={t('Enter middle name', { ns: 'other' })}
                isShadow
                className={s.input}
                error={!!errors[middlename_locale]}
                touched={!!touched[middlename_locale]}
                disabled={domainsContacts[middlename_locale]?.$readonly === 'yes'}
              />
              <InputField
                inputWrapperClass={s.inputHeight}
                name={middlename}
                label={`${t('Middle name', { ns: 'other' })} (EN):`}
                placeholder={t('Enter middle name', { ns: 'other' })}
                isShadow
                className={s.input}
                error={!!errors[middlename]}
                touched={!!touched[middlename]}
                disabled={domainsContacts[middlename]?.$readonly === 'yes'}
                onChange={e => validateENFields(e, middlename)}
              />
              <InputField
                inputWrapperClass={s.inputHeight}
                type="email"
                name={email}
                label={`${t('Email')}:`}
                placeholder={t('Enter email', { ns: 'other' })}
                isShadow
                className={s.input}
                error={!!errors[email]}
                touched={!!touched[email]}
                isRequired
                disabled={domainsContacts[email]?.$readonly === 'yes'}
              />
              <CustomPhoneInput
                containerClass={s.phoneInputContainer}
                inputClass={s.phoneInputClass}
                value={values[phone]}
                wrapperClass={s.phoneInput}
                labelClass={s.phoneInputLabel}
                label={`${t('Phone', { ns: 'other' })}:`}
                handleBlur={handleBlur}
                setFieldValue={setFieldValue}
                setCountryCode={setCountryCode}
                name={phone}
                isRequired
                disabled={domainsContacts[phone]?.$readonly === 'yes'}
              />
            </div>
          </div>

          <div className={s.formBlock}>
            <div className={s.formBlockTitle}>{t('Contact address')}</div>
            <div className={s.formFieldsBlock}>
              <Select
                placeholder={t('Not chosen', { ns: 'other' })}
                label={`${t('The country', { ns: 'other' })}:`}
                value={values[location_country]}
                getElement={item => setFieldValue(location_country, item)}
                isShadow
                className={s.select}
                itemsList={domainsContacts[location_country_list]?.map(
                  ({ $key, $, $image }) => ({
                    label: (
                      <div className={s.countrySelectItem}>
                        {$key !== 'null' && (
                          <img
                            src={`${process.env.REACT_APP_BASE_URL}${$image}`}
                            alt="flag"
                          />
                        )}
                        {t(`${$.trim()}`)}
                      </div>
                    ),
                    value: $key,
                  }),
                )}
                isRequired
                dropdownClass={s.selectDropDown}
                withoutArrow={domainsContacts[location_country_list]?.length < 2}
                disabled={domainsContacts[location_country_list]?.length < 2}
                error={errors[location_country]}
              />
              <InputField
                inputWrapperClass={s.inputHeight}
                name={location_postcode}
                label={`${t('Index', { ns: 'other' })}:`}
                placeholder={t('Enter index', { ns: 'other' })}
                isShadow
                className={s.input}
                error={!!errors[location_postcode]}
                touched={!!touched[location_postcode]}
                isRequired
                disabled={domainsContacts[location_postcode]?.$readonly === 'yes'}
              />
              <InputField
                inputWrapperClass={s.inputHeight}
                name={location_state}
                label={`${t('Region', { ns: 'other' })} (EN):`}
                placeholder={t('Enter region', { ns: 'other' })}
                isShadow
                className={s.input}
                error={!!errors[location_state]}
                touched={!!touched[location_state]}
                isRequired
                disabled={domainsContacts[location_state]?.$readonly === 'yes'}
                onChange={e => validateENFields(e, location_state)}
              />
              <InputField
                inputWrapperClass={s.inputHeight}
                name={location_city}
                label={`${t('City', { ns: 'other' })} (EN):`}
                placeholder={t('Enter city', { ns: 'other' })}
                isShadow
                className={s.input}
                error={!!errors[location_city]}
                touched={!!touched[location_city]}
                isRequired
                disabled={domainsContacts[location_city]?.$readonly === 'yes'}
                onChange={e => validateENFields(e, location_city)}
              />
              <InputField
                inputWrapperClass={s.inputHeight}
                name={location_address}
                label={`${t('The address', { ns: 'other' })} (EN):`}
                placeholder={t('Enter address', { ns: 'other' })}
                isShadow
                className={s.input}
                error={!!errors[location_address]}
                touched={!!touched[location_address]}
                isRequired
                disabled={domainsContacts[location_address]?.$readonly === 'yes'}
                onChange={e => validateENFields(e, location_address)}
              />
            </div>
          </div>
        </div>
      </form>
    </FormikProvider>
  )
}
