import { Select, InputField, InputWithAutocomplete, SelectGeo } from '@components'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { authSelectors, payersOperations, payersActions, payersSelectors } from '@redux'
import { useEffect, useReducer, useState } from 'react'
import { useFormikContext } from 'formik'
import s from './PayersList.module.scss'
import cn from 'classnames'
import {
  ADDRESS_REGEX,
  ADDRESS_SPECIAL_CHARACTERS_REGEX,
  CNP_REGEX,
} from '@utils/constants'

export default function PayersList({ signal, setIsLoading, renderTitle = () => {} }) {
  const { t } = useTranslation(['billing', 'other', 'payers'])
  const [errorFields, setErrorFields] = useState({})

  const { values, setFieldValue, errors, touched } = useFormikContext()

  const dispatch = useDispatch()
  const payersList = useSelector(payersSelectors.getPayersList)
  const payersSelectedFields = useSelector(payersSelectors.getPayersSelectedFields)
  const payersSelectLists = useSelector(payersSelectors.getPayersSelectLists)

  const geoData = useSelector(authSelectors.getGeoData)

  const [selectedPayerFields, setSelectedPayerFields] = useState(null)
  const [payerFieldList, setPayerFieldList] = useState(null)

  const [state, setState] = useReducer((state, action) => {
    return { ...state, ...action }
  }, {})

  useEffect(() => {
    dispatch(payersOperations.getPayers({}, signal, setIsLoading))

    return () => {
      dispatch(payersActions.setPayersData({ selectedPayerFields: null, state: null }))
      dispatch(payersActions.setPayersList(null))
    }
  }, [])

  useEffect(() => {
    dispatch(payersActions.setPayersData({ selectedPayerFields }))
  }, [selectedPayerFields])

  useEffect(() => {
    dispatch(payersActions.setPayersData({ state }))
  }, [state])

  useEffect(() => {
    if (payersList) {
      if (payersList.length !== 0) {
        const requestFields = {
          elid: payersSelectedFields?.profile || payersList[payersList.length - 1]?.id?.$,
        }

        dispatch(
          payersOperations.getPayerEditInfo(
            requestFields,
            false,
            null,
            setSelectedPayerFields,
            false,
            setPayerFieldList,
            signal,
            setIsLoading,
          ),
        )
        return
      } else {
        dispatch(
          payersOperations.getPayerCountryType(
            setSelectedPayerFields,
            signal,
            setIsLoading,
          ),
        )
      }
    }
  }, [payersList])

  const changeProfileTypeHandler = value => {
    setState({ profiletype: value })
    const data = {
      country: payersSelectLists?.country[0]?.$key,
      profiletype: value,
    }
    dispatch(payersOperations.getPayerModalInfo(data))
  }

  const addressValidation = value => {
    let error
    if (!value) {
      error = t('Is a required field', { ns: 'other' })
    } else if (!value.match(ADDRESS_REGEX)) {
      error = t('address_error_msg', { ns: 'other' })
    } else if (!value.match(ADDRESS_SPECIAL_CHARACTERS_REGEX)) {
      error = t('symbols_restricted', { ns: 'other' })
    }
    return error
  }

  const requiredValidation = value => {
    let error
    if (!value) {
      error = t('Is a required field', { ns: 'other' })
    }
    return error
  }

  const validateCnp = value => {
    let error
    if (!value) {
      error = t('Is a required field', { ns: 'other' })
    } else if (!value.match(CNP_REGEX)) {
      error = t('cnp_validation', { ns: 'other' })
    }
    return error
  }

  useEffect(() => {
    if (
      selectedPayerFields?.address_physical &&
      addressValidation(selectedPayerFields?.address_physical)
    ) {
      setErrorFields(prev => ({
        ...prev,
        address_physical: {
          isError: true,
          message: t('set_valid_address', { ns: 'payers' }),
        },
      }))
    } else {
      setErrorFields(prev => ({ ...prev, address_physical: {} }))
    }
  }, [selectedPayerFields])

  const payerTypeArrayHandler = () => {
    const arr = payerFieldList?.profiletype
      ? payerFieldList?.profiletype
      : payersSelectLists?.profiletype

    return arr?.map(({ $key, $ }) => ({
      label: t(`${$.trim()}`, { ns: 'payers' }),
      value: $key,
    }))
  }

  const setPayerHandler = val => {
    setFieldValue('profile', val)
    let data = null
    if (val === 'new') {
      data = {
        country: payersSelectLists?.country[0]?.$key,
        profiletype: payersSelectLists?.profiletype[0]?.$key,
      }
      dispatch(
        payersOperations.getPayerModalInfo(
          data,
          false,
          null,
          setSelectedPayerFields,
          true,
        ),
      )
    } else {
      data = { elid: val }

      dispatch(
        payersOperations.getPayerEditInfo(
          data,
          false,
          null,
          setSelectedPayerFields,
          false,
          setPayerFieldList,
        ),
      )
    }

    setState({ person: null, cityPhysical: null, addressPhysical: null })
  }

  return (
    <div className={s.formBlock}>
      {renderTitle()}
      <div className={s.payerBlock}>
        {payerTypeArrayHandler()?.length > 1 && (
          <Select
            placeholder={t('Not chosen', { ns: 'other' })}
            label={`${t('Payer status', { ns: 'payers' })}:`}
            value={values.profiletype}
            getElement={changeProfileTypeHandler}
            isShadow
            className={s.select}
            dropdownClass={s.selectDropdownClass}
            itemsList={payerTypeArrayHandler()}
          />
        )}

        {payersSelectedFields?.profiletype === '1' &&
        payersSelectedFields?.country === '181' &&
        !selectedPayerFields?.cnp ? (
          <>
            <InputField
              inputWrapperClass={s.inputHeight}
              name="cnp"
              label={`${t('CNP', { ns: 'payers' })}:`}
              placeholder={t('Enter data', { ns: 'other' })}
              isShadow
              className={s.inputBig}
              error={!!errors.cnp}
              touched={!!touched.cnp}
              value={values.cnp}
              onChange={e => setState({ cnp: e.target.value })}
              validate={validateCnp}
              type="number"
              isRequired
            />
          </>
        ) : null}

        {(values?.profiletype === '3' || values?.profiletype === '2') &&
        !selectedPayerFields?.name ? (
          <InputField
            inputWrapperClass={s.inputHeight}
            name="name"
            label={`${t('Company name', { ns: 'payers' })}:`}
            placeholder={t('Enter data', { ns: 'other' })}
            isShadow
            className={s.inputBig}
            error={!!errors.name}
            touched={!!touched.name}
            isRequired
            value={values.name}
            onChange={e => setState({ name: e.target.value })}
            onBlur={e => setState({ name: e.target.value.trim() })}
            validate={requiredValidation}
          />
        ) : null}

        {!!payersList?.length && (
          <Select
            placeholder={t('Not chosen', { ns: 'other' })}
            label={`${t('Choose payer', { ns: 'billing' })}:`}
            value={values.profile}
            getElement={item => setPayerHandler(item)}
            isShadow
            className={s.select}
            dropdownClass={s.additionalSelectPayer}
            itemsList={[...payersList]?.map(({ name, id }) => ({
              label: t(`${name?.$?.trim()}`),
              value: id?.$,
            }))}
            disabled={payersList.length === 1}
            withoutArrow={payersList.length === 1}
          />
        )}

        {!selectedPayerFields?.person && (
          <InputField
            inputWrapperClass={s.inputHeight}
            name="person"
            label={
              values?.profiletype === '1'
                ? `${t('Full name', { ns: 'other' })}:`
                : `${t('The contact person', { ns: 'payers' })}:`
            }
            placeholder={t('Enter data', { ns: 'other' })}
            isShadow
            className={s.inputBig}
            error={!!errors.person}
            touched={!!touched.person}
            isRequired
            value={values.person}
            onChange={e => setState({ person: e.target.value })}
            onBlur={e => setState({ person: e.target.value.trim() })}
            validate={requiredValidation}
          />
        )}

        <div className={s.geo_wrapper}>
          {!selectedPayerFields?.person && (
            <SelectGeo
              selectValue={values.country}
              selectClassName={s.select}
              countrySelectClassName={s.countrySelectItem}
              geoData={geoData}
              payersSelectLists={payersSelectLists}
            />
          )}

          {!selectedPayerFields?.city_physical && (
            <InputField
              inputWrapperClass={s.inputHeight}
              name="city_physical"
              label={`${t('City', { ns: 'other' })}:`}
              placeholder={t('Enter city', { ns: 'other' })}
              isShadow
              className={s.inputBig}
              error={!!errors.city_physical}
              touched={!!touched.city_physical}
              value={values.city_physical}
              onChange={e => setState({ cityPhysical: e.target.value })}
              onBlur={e => setState({ cityPhysical: e.target.value.trim() })}
              validate={requiredValidation}
            />
          )}

          {(!selectedPayerFields?.address_physical ||
            errorFields?.address_physical.isError) && (
            <>
              <div className={cn(s.inputBig, s.nsInputBlock)}>
                <InputWithAutocomplete
                  fieldName="address_physical"
                  error={
                    !!errors.address_physical || errorFields.address_physical?.isError
                  }
                  touched={
                    !!touched.address_physical || errorFields.address_physical?.isError
                  }
                  externalValue={values.address_physical}
                  setFieldValue={val => {
                    setErrorFields(prev => ({
                      ...prev,
                      address_physical: { ...prev.address_physical, message: '' },
                    }))
                    setState({ addressPhysical: val })
                  }}
                  validate={addressValidation}
                  infoText={t('address_format', { ns: 'other' })}
                />
                {errorFields.address_physical?.message && !errors.address_physical && (
                  <span className={s.error_message}>
                    {errorFields.address_physical.message}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {payersSelectedFields?.eu_vat_field && !selectedPayerFields?.eu_vat ? (
          <InputField
            inputWrapperClass={s.inputHeight}
            name="eu_vat"
            label={`${t('EU VAT-number')}:`}
            placeholder={t('Enter data', { ns: 'other' })}
            isShadow
            className={s.inputBig}
            error={!!errors.eu_vat}
            touched={!!touched.eu_vat}
            value={values.eu_vat}
            onChange={e => setState({ euVat: e.target.value })}
            infoText={t('eu_vat_info_text', { ns: 'other' })}
            validate={requiredValidation}
            isRequired
          />
        ) : null}
      </div>
    </div>
  )
}
