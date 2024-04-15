import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Formik, Form } from 'formik'
import {
  Select,
  InputField,
  Button,
  CheckBox,
  InputWithAutocomplete,
  SelectGeo,
  Modal,
  Icon,
} from '@components'
import { payersOperations, payersSelectors, authSelectors } from '@redux'
import { OFERTA_URL, PRIVACY_URL } from '@config/config'
import s from './ModalAddPayer.module.scss'
import * as Yup from 'yup'
import {
  ADDRESS_SPECIAL_CHARACTERS_REGEX,
  ADDRESS_REGEX,
  CNP_REGEX,
} from '@src/utils/constants'

export default function ModalAddPayer(props) {
  const dispatch = useDispatch()

  const { t } = useTranslation(['payers', 'other', 'trusted_users', 'domains'])

  const { elid, closeAddModalHandler } = props

  const dropdownDescription = useRef(null)

  const payersSelectLists = useSelector(payersSelectors.getPayersSelectLists)
  const payersSelectedFields = useSelector(payersSelectors.getPayersSelectedFields)

  const geoData = useSelector(authSelectors.getGeoData)

  useEffect(() => {
    // let data = {
    //   country: payersSelectLists?.country[0]?.$key,
    //   profiletype: payersSelectLists?.profiletype[0]?.$key,
    // }

    if (elid) {
      dispatch(payersOperations.getPayerEditInfo({ elid }))
      return
    }

    dispatch(payersOperations.getPayerCountryType())
  }, [])

  if (!payersSelectedFields) {
    return null
  }

  const validationSchema = Yup.object().shape({
    person: Yup.string().required(t('Is a required field', { ns: 'other' })),
    city_physical: Yup.string().required(t('Is a required field', { ns: 'other' })),
    address_physical: Yup.string()
      .matches(ADDRESS_SPECIAL_CHARACTERS_REGEX, t('symbols_restricted', { ns: 'other' }))
      .matches(ADDRESS_REGEX, t('address_error_msg', { ns: 'other' }))
      .required(t('Is a required field', { ns: 'other' })),
    name:
      payersSelectedFields?.profiletype === '2' ||
      payersSelectedFields?.profiletype === '3'
        ? Yup.string().required(t('Is a required field', { ns: 'other' }))
        : null,
    eu_vat: payersSelectedFields?.eu_vat_field
      ? Yup.string().required(t('Is a required field', { ns: 'other' }))
      : null,
    cnp:
      payersSelectedFields?.profiletype === '1' && payersSelectedFields?.country === '181'
        ? Yup.string()
            .required(t('Is a required field', { ns: 'other' }))
            .matches(CNP_REGEX, t('cnp_validation', { ns: 'other' }))
        : null,
    [payersSelectedFields?.offer_field]: elid ? null : Yup.bool().oneOf([true]),
  })

  const createPayerHandler = values => {
    let data = {
      ...values,
      name: values?.name,
      clicked_button: 'finish',
      progressid: false,
      sok: 'ok',
      [payersSelectedFields?.offer_field]: values[payersSelectedFields?.offer_field]
        ? 'on'
        : 'off',
    }

    /** ------- Analytics ------- */
    if (!values?.profile) {
      // Facebook pixel event
      if (window.fbq) window.fbq('track', 'AddPaymentInfo')
      // Quora pixel event
      if (window.qp) window.qp('track', 'AddPaymentInfo')
      // GTM
      window.dataLayer?.push({ event: 'AddPaymentInfo' })
    }
    /** ------- /Analytics ------- */

    if (values.profiletype && values.profiletype !== '1') {
      data.jobtitle = 'jobtitle'
      data.rdirector = 'rdirector'
      data.rjobtitle = 'rjobtitle'
      data.ddirector = 'ddirector'
      data.djobtitle = 'djobtitle'
      data.baseaction = 'baseaction'
    }
    dispatch(payersOperations.getPayerModalInfo(data, true, closeAddModalHandler))
  }

  const editPayerHandler = values => {
    let data = {
      ...values,
      country_physical: values?.country,
      sok: 'ok',
      elid: elid,
    }
    dispatch(payersOperations.getPayerEditInfo(data, true, closeAddModalHandler))
  }

  const validateCnp = value => {
    const cnpRegex = /^[0-9]+$/
    return (cnpRegex.test(value) && value.length <= 13) || value === ''
  }

  return (
    <Modal isOpen closeModal={closeAddModalHandler}>
      <Modal.Header>
        <span className={s.headerText}>
          {t(elid ? 'Edit the selected payer' : 'Adding a payer')}
        </span>
      </Modal.Header>
      <Modal.Body>
        <Formik
          enableReinitialize
          validateOnMount={false}
          validationSchema={validationSchema}
          initialValues={{
            country:
              payersSelectedFields?.country ||
              payersSelectedFields?.country_physical ||
              geoData?.clients_country_id ||
              '',
            profiletype: payersSelectedFields?.profiletype || '',
            maildocs: payersSelectedFields?.maildocs || '',
            email: payersSelectedFields?.email || '',
            phone: payersSelectedFields?.phone || '',
            person: payersSelectedFields?.person || '',
            name: payersSelectedFields?.name || '',
            eu_vat: payersSelectedFields?.eu_vat || '',
            cnp: payersSelectedFields?.cnp || '',
            postcode_physical: payersSelectedFields?.postcode_physical || '',
            passport: payersSelectedFields?.passport || '',
            address_physical: payersSelectedFields?.address_physical || '',
            city_physical:
              payersSelectedFields?.city_physical || geoData?.clients_city || '',
            [payersSelectedFields?.offer_field]: elid ? null : false,
          }}
          onSubmit={elid ? editPayerHandler : createPayerHandler}
        >
          {({ errors, touched, setFieldValue, values }) => {
            const onProfileTypeChange = item => {
              setFieldValue('profiletype', item)
              let data = {
                country: payersSelectLists?.country[0]?.$key,
                profiletype: item,
              }
              if (elid) {
                data = { elid }
                dispatch(payersOperations.getPayerEditInfo(data))
                return
              }
              dispatch(payersOperations.getPayerModalInfo(data))
            }

            return (
              <Form id="add-payer">
                <div className={s.formBlock}>
                  <div className={s.formBlockTitle}>1. {t('Main')}</div>
                  <div className={s.formFieldsBlock}>
                    <Select
                      placeholder={t('Not chosen', { ns: 'other' })}
                      label={`${t('Payer status')}:`}
                      value={values.profiletype}
                      getElement={item => onProfileTypeChange(item)}
                      isShadow
                      className={s.select}
                      dropdownClass={s.selectDropdownClass}
                      itemsList={payersSelectLists?.profiletype?.map(({ $key, $ }) => ({
                        label: t(`${$.trim()}`),
                        value: $key,
                      }))}
                      inputClassName={s.field}
                      disabled={payersSelectLists?.profiletype?.length === 1}
                      withoutArrow={payersSelectLists?.profiletype?.length === 1}
                    />

                    {payersSelectedFields?.profiletype === '1' &&
                    payersSelectedFields?.country === '181' ? (
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="cnp"
                        label={`${t('CNP')}:`}
                        placeholder={t('Enter data', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.name}
                        touched={!!touched.name}
                        isRequired
                        inputClassName={s.field}
                        onChange={e => {
                          const value = e.target.value
                          const isValid = validateCnp(value)

                          if (!isValid) {
                            return
                          }

                          setFieldValue('cnp', value)
                        }}
                      />
                    ) : null}

                    {values?.profiletype === '3' || values?.profiletype === '2' ? (
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="name"
                        label={`${t('Company name')}:`}
                        placeholder={t('Enter data', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.name}
                        touched={!!touched.name}
                        isRequired
                        inputClassName={s.field}
                        onBlur={e => setFieldValue('name', e.target.value.trim())}
                      />
                    ) : null}

                    <InputField
                      inputWrapperClass={s.inputHeight}
                      name="person"
                      label={`${t('The contact person')}:`}
                      placeholder={t('Enter data', { ns: 'other' })}
                      isShadow
                      className={s.input}
                      error={!!errors.person}
                      touched={!!touched.person}
                      isRequired
                      inputClassName={s.field}
                      disabled={!!elid}
                      onBlur={e => setFieldValue('person', e.target.value.trim())}
                    />

                    {payersSelectedFields?.eu_vat_field ? (
                      <InputField
                        inputWrapperClass={s.inputHeight}
                        name="eu_vat"
                        label={`${t('EU VAT-number')}:`}
                        placeholder={t('Enter data', { ns: 'other' })}
                        isShadow
                        className={s.input}
                        error={!!errors.eu_vat}
                        touched={!!touched.eu_vat}
                        inputClassName={s.field}
                        infoText={t('eu_vat_info_text', { ns: 'other' })}
                        isRequired
                      />
                    ) : null}
                  </div>
                </div>
                <div className={s.formBlock}>
                  <div className={s.formBlockTitle}>2. {t('Actual address')}</div>
                  <div className={s.formFieldsBlock}>
                    <SelectGeo
                      setSelectFieldValue={item => setFieldValue('country', item)}
                      selectValue={payersSelectedFields?.country}
                      selectClassName={s.select}
                      countrySelectClassName={s.countrySelectItem}
                      geoData={geoData}
                      payersSelectLists={payersSelectLists}
                      inputClassName={s.field}
                    />

                    <InputField
                      inputWrapperClass={s.inputHeight}
                      name="city_physical"
                      label={`${t('City', { ns: 'other' })}:`}
                      placeholder={t('Enter city', { ns: 'other' })}
                      isShadow
                      className={s.input}
                      error={!!errors.city_physical}
                      touched={!!touched.city_physical}
                      inputClassName={s.field}
                      isRequired
                      onBlur={e => setFieldValue('city_physical', e.target.value.trim())}
                    />

                    <div className={s.nsInputBlock}>
                      <InputWithAutocomplete
                        fieldName="address_physical"
                        error={!!errors.address_physical}
                        touched={!!touched.address_physical}
                        externalValue={values.address_physical}
                        setFieldValue={val => {
                          setFieldValue('address_physical', val)
                        }}
                        inputClassName={s.field}
                      />

                      <button type="button" className={s.infoBtn}>
                        <Icon name="Info" />
                        <div ref={dropdownDescription} className={s.descriptionBlock}>
                          {t('address_format', { ns: 'other' })}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
                {payersSelectedFields?.offer_link &&
                  (payersSelectedFields?.passport_field || !elid) && (
                    <div className={s.formBlock}>
                      <div>
                        {payersSelectedFields?.offer_link && (
                          <div className={s.offerBlock}>
                            <CheckBox
                              value={values[payersSelectedFields?.offer_field]}
                              onClick={() =>
                                setFieldValue(
                                  `${payersSelectedFields?.offer_field}`,
                                  !values[payersSelectedFields?.offer_field],
                                )
                              }
                              className={s.checkbox}
                              error={!!errors[payersSelectedFields?.offer_field]}
                              touched={!!touched[payersSelectedFields?.offer_field]}
                            />
                            <div className={s.offerBlockText}>
                              {t('I agree with', {
                                ns: 'payers',
                              })}{' '}
                              <a
                                target="_blank"
                                href={OFERTA_URL}
                                rel="noreferrer"
                                className={s.offerBlockLink}
                              >
                                {t('Terms of Service', { ns: 'domains' })}
                              </a>{' '}
                              {t('and', { ns: 'domains' })}{' '}
                              <a
                                target="_blank"
                                href={PRIVACY_URL}
                                rel="noreferrer"
                                className={s.offerBlockLink}
                              >
                                {t('Terms of the offer', { ns: 'domains' })}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
              </Form>
            )
          }}
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className={s.saveBtn}
          isShadow
          size="medium"
          label={t(elid ? 'Save' : 'Create', { ns: 'other' })}
          type="submit"
          form="add-payer"
        />
        <button onClick={closeAddModalHandler} type="button" className={s.cancel}>
          {t('Cancel', { ns: 'other' })}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
