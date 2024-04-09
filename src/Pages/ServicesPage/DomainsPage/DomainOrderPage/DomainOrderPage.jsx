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
import { useCancelRequest, cookies } from '@src/utils'

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
  const [siteDomainCheckData, setSiteDomainCheckData] = useState([])
  const [inputValue, setInputValue] = useState('')
  const isDomainsOrderAllowed = location?.state?.isDomainsOrderAllowed

  const setAutoProlong = () => (!autoprolongPrices.length ? setAutoprolongPrices : null)

  useEffect(() => {
    if (
      siteDomainCheckData?.length > 0 &&
      'list' in pickUpDomains &&
      selectedDomainsNames?.length > 0 &&
      selectedDomains?.length > 0 &&
      inputValue
    ) {
      registerDomainHandler()
    }
  }, [
    siteDomainCheckData,
    pickUpDomains,
    selectedDomainsNames,
    selectedDomains,
    inputValue,
  ])

  useEffect(() => {
    const cartFromSite = localStorage.getItem('site_cart')
    const domainDetailData = JSON.parse(cookies.getCookie('domain_order'))
    if (isDomainsOrderAllowed || cartFromSite) {
      /* If link is correct and cookies data exist => quiting from this functions. Logic for that case below in the next UseEffect */
      if (cartFromSite && domainDetailData?.length > 0) {
        return
      }

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
    const domainDetailData = JSON.parse(cookies.getCookie('domain_order'))
    const domainDataFromSite = JSON.parse(cartFromSite)

    const zonesArrayId = []

    if (cartFromSite && domainDetailData) {
      !!domainDetailData && setSiteDomainCheckData(domainDetailData)

      for (const domain of domainDetailData) {
        const zoneId = Object.values(domain)[0]?.info?.billing_id
        zonesArrayId.push(zoneId)
      }

      const { domain_name } = domainDataFromSite

      if (domain_name && zonesArrayId?.length > 0) {
        setInputValue(domain_name)
        setSelectedDomains(zonesArrayId.join(', '))
        setDomainsNameHandler(
          {
            domain_name,
            selectedDomains: zonesArrayId,
          },
          domainDetailData,
        )
      } else if (zonesArrayId?.length > 0) {
        setSelectedDomains(zonesArrayId)
      }

      /* Removing data from link and cookies domain data from the site */
      localStorage.removeItem('site_cart')
      cookies.eraseCookie('domain_order')
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

  const setDomainsNameHandler = (values, siteDomainCheckData = []) => {
    values['selected_pricelist'] = values?.selectedDomains.join(', ')
    values['sv_field'] = 'ok_whois'

    siteDomainCheckData.length > 0
      ? values?.selectedDomains?.forEach(el => (values[`select_pricelist_${el}`] = 'on'))
      : selectedDomains.forEach(el => (values[`select_pricelist_${el}`] = 'on'))

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
        siteDomainCheckData,
      ),
    )

    !siteDomainCheckData.length < 1 && setSelectedDomainsNames([])
  }

  const registerDomainHandler = () => {
    const selected_domain_names = selectedDomainsNames?.map(d => {
      const [domain] = siteDomainCheckData.length > 0 ? Object.keys(d) : d

      return domain
    })

    const checkedDomain = pickUpDomains?.checked_domain?.$?.split(', ')
    const newCheckedDomains = []

    const selected_domain = []
    pickUpDomains?.selected?.forEach(el => {
      const newString = el?.replace('select_domain_', '')

      selected_domain?.push(newString)
      checkedDomain?.forEach(checked => {
        const check = checked.substring(0, checked.length - 1) + '1'

        if (checked?.includes(newString)) {
          newCheckedDomains.push(check)
        }
      })
    })

    const selected_domain_real_name = selectedDomainsNames?.map(d => {
      const [domainName] = siteDomainCheckData.length > 0 ? Object.keys(d) : d

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

      /* 
      Below is the logic for checking if the selected domain also exists in selected_domain_real_name.
      Because it may happen that all the domain zones that are available will be selected,
      but we should add only those zones that the user has selected manually. */

      data['selected_domain'] = selected_domain
        ?.filter(SelectedDomain => {
          const zoneArr = selected_domain_real_name?.map(domain => domain?.split('.')[1])
          return zoneArr?.some(zone => SelectedDomain?.includes(zone))
        })
        ?.join(', ')
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
                    selected={selectedDomains}
                    registerDomainHandler={registerDomainHandler}
                    transfer={transfer}
                    siteDomainCheckData={siteDomainCheckData}
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
