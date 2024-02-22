import { useEffect, useState } from 'react'
import {
  BreadCrumbs,
  Button,
  DomainsZone,
  InputField,
  DomainsPickUpZones,
  Loader,
} from '@components'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { Formik, Form } from 'formik'
import { domainsOperations } from '@redux'
import * as route from '@src/routes'
import * as Yup from 'yup'
import s from './DomainOrderPage.module.scss'
import { useCancelRequest } from '@src/utils'

export default function Component({ transfer = false }) {
  const { t } = useTranslation(['domains', 'other'])
  const dispatch = useDispatch()

  const location = useLocation()
  const navigate = useNavigate()

  const { signal, isLoading, setIsLoading } = useCancelRequest()

  const [domains, setDomains] = useState([])
  const [autoprolongPrices, setAutoprolongPrices] = useState([])
  const [pickUpDomains, setPickUpDomains] = useState([])
  const [selectedDomains, setSelectedDomains] = useState([])
  const [selectedDomainsNames, setSelectedDomainsNames] = useState([])
  const [siteZoneArray, setSiteZoneArray] = useState([])
  const [inputValue, setInputValue] = useState('')
  const isDomainsOrderAllowed = location?.state?.isDomainsOrderAllowed

  const setAutoProlong = () => (!autoprolongPrices.length ? setAutoprolongPrices : null)

  useEffect(() => {
    if (
      'list' in pickUpDomains &&
      selectedDomainsNames?.length > 0 &&
      selectedDomains?.length > 0 &&
      inputValue
    ) {
      registerDomainHandler()
    }
  }, [pickUpDomains, selectedDomainsNames, selectedDomains, inputValue])

  useEffect(() => {
    const cartFromSite = localStorage.getItem('site_cart')
    if (isDomainsOrderAllowed || cartFromSite) {
      if (transfer) {
        const dataTransfer = { domain_action: 'transfer' }
        dispatch(
          domainsOperations.getDomainsOrderName(
            setDomains,
            setAutoProlong(),
            dataTransfer,
            undefined,
            signal,
            setIsLoading,
          ),
        )
      } else {
        dispatch(
          domainsOperations.getDomainsOrderName(
            setDomains,
            setAutoProlong(),
            undefined,
            undefined,
            signal,
            setIsLoading,
          ),
        )
      }
    } else {
      navigate(route.DOMAINS, { replace: true })
    }
  }, [])

  useEffect(() => {
    const cartFromSite = localStorage.getItem('site_cart')
    const domainDataFromSite = JSON.parse(cartFromSite)

    if (cartFromSite && domains?.length > 0) {
      const { domain_name, zone } = domainDataFromSite

      const zonesArray = zone.split(', ')
      /* Setting array zones from site to transfer it into DomainPuckUpZones component */
      setSiteZoneArray(zonesArray)

      const matchingDomains = domains?.filter(domain =>
        zonesArray.includes(domain?.tld?.$),
      )

      if (domain_name && matchingDomains?.length > 0) {
        setInputValue(domain_name)
        setSelectedDomains(matchingDomains.map(el => el?.id?.$))
        setDomainsNameHandler(
          {
            domain_name,
            selectedDomains: matchingDomains.map(el => el?.id?.$),
          },
          true,
        )
      } else if (matchingDomains?.length > 0) {
        setSelectedDomains(matchingDomains.map(el => el?.id?.$))
      }
      localStorage.removeItem('site_cart')
    }
  }, [domains])

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  const validationSchema = Yup.object().shape({
    domain_name: Yup.string()
      .required(t('Is a required field', { ns: 'other' }))
      .min(2, t('Domain name must be at least 2 characters long', { ns: 'domains' }))
      .max(63, t('Domain name must be at most 63 characters long', { ns: 'domains' })),
    selectedDomains: Yup.array().min(1, t('choose_min_one_domain', { ns: 'domains' })),
  })

  const setDomainsNameHandler = (values, isDataFromSite = false) => {
    values['selected_pricelist'] = values?.selectedDomains.join(', ')
    values['sv_field'] = 'ok_whois'
    !isDataFromSite
      ? selectedDomains.forEach(el => (values[`select_pricelist_${el}`] = 'on'))
      : values?.selectedDomains?.forEach(el => (values[`select_pricelist_${el}`] = 'on'))
    if (transfer) {
      values['domain_action'] = 'transfer'
    }
    dispatch(
      domainsOperations.getDomainsOrderName(
        setPickUpDomains,
        setAutoProlong(),
        values,
        true,
        signal,
        setIsLoading,
      ),
    )

    !isDataFromSite && setSelectedDomainsNames([])
  }

  const registerDomainHandler = () => {
    const selected_domain_names = selectedDomainsNames?.map(d => {
      const [domain] = d
      return domain
    })

    const checkedDomain = pickUpDomains?.checked_domain?.$?.split(', ')
    const newCheckedDomains = []

    const selected_domain = []
    selected_domain_names?.forEach(el => {
      const newString = el?.replace('select_domain_', '')

      selected_domain?.push(newString)
      checkedDomain?.forEach(checked => {
        const check = checked.substring(0, checked.length - 1) + '1'

        if (checked?.includes(newString.split('.')[1])) {
          newCheckedDomains.push(check)
        }
      })
    })

    const selected_domain_real_name = selectedDomainsNames?.map(d => {
      const [domainName] = d
      return domainName
    })

    const data = {
      domain_name: pickUpDomains?.domain_name,
      'zoom-domain_name': pickUpDomains?.domain_name,
      checked_domain: newCheckedDomains?.join(', '),
      selected_domain: selected_domain?.join(', '),
      selected_domain_real_name: selected_domain_real_name?.join(', '),
    }

    selected_domain_names?.forEach(n => {
      data[n] = 'on'
    })

    if (transfer) {
      data['domain_action'] = 'transfer'
    }

    navigate &&
      navigate(
        transfer ? route.DOMAINS_TRANSFER_CONTACT_INFO : route.DOMAINS_CONTACT_INFO,
        { state: { domainInfo: data }, replace: true },
      )
  }

  return (
    <>
      <div className={s.page_wrapper}>
        <BreadCrumbs pathnames={parseLocations()} />
        <h1 className={s.page_title}>
          {transfer ? t('Domain name transfer') : t('Domain name order')}
        </h1>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            domain_name: inputValue,
            selectedDomains: selectedDomains,
          }}
          onSubmit={setDomainsNameHandler}
          validateOnChange={true}
        >
          {({ errors, touched, setFieldValue, setFieldError }) => {
            function validateInput(event) {
              const value = event.target.value
              const domainnameRegex = /^(?=[a-zA-Z0-9-]*$)[^\u0400-\u04FF]*$/
              if (!domainnameRegex.test(value)) {
                setFieldError('domain_name', t('Domain name only Latin'))
                touched.domain_name = true
              } else {
                setFieldError('domain_name', '')
                setFieldValue('domain_name', value)
                setInputValue(value)
              }
            }

            useEffect(() => {
              setFieldValue('selectedDomains', selectedDomains)
            }, [selectedDomains])
            return (
              <>
                <Form className={s.form}>
                  <InputField
                    name="domain_name"
                    type="text"
                    label={`${t('Domain name')}:`}
                    placeholder={t('Enter domain name')}
                    className={s.input}
                    inputClassName={s.inputClassName}
                    inputWrapperClass={s.inputHeight}
                    error={!!errors.domain_name}
                    touched={!!touched.domain_name}
                    isShadow
                    value={inputValue}
                    onChange={validateInput}
                  />
                  <Button
                    className={s.searchBtn}
                    isShadow
                    size="medium"
                    label={t(transfer ? 'Check' : 'Pick up')}
                    type="submit"
                  />
                </Form>
                {pickUpDomains?.list ? (
                  <DomainsPickUpZones
                    setSelectedDomains={setSelectedDomainsNames}
                    selectedDomains={selectedDomainsNames}
                    domains={pickUpDomains?.list}
                    selected={pickUpDomains?.selected}
                    registerDomainHandler={registerDomainHandler}
                    transfer={transfer}
                    siteZoneArray={siteZoneArray}
                  />
                ) : (
                  <DomainsZone
                    setSelectedDomains={setSelectedDomains}
                    selectedDomains={selectedDomains}
                    domains={domains}
                    transfer={transfer}
                    autoprolongPrices={autoprolongPrices}
                  />
                )}
              </>
            )
          }}
        </Formik>
      </div>

      {isLoading && <Loader local shown={isLoading} />}
    </>
  )
}
