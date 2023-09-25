import { useEffect, useState, useRef } from 'react'
import { BreadCrumbs, Button, DomainContactInfoItem, Loader } from '@components'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { domainsOperations } from '@redux'
import * as route from '@src/routes'
import s from './DomainContactInfoPage.module.scss'
import { useCancelRequest } from '@src/utils'

const formTypes = ['owner', 'admin', 'tech', 'bill']

export default function Component({ transfer = false }) {
  const dispatch = useDispatch()

  const { t } = useTranslation(['domains', 'other', 'trusted_users'])
  const navigate = useNavigate()

  const { signal, isLoading, setIsLoading } = useCancelRequest()

  const location = useLocation()

  const [formData, setFormData] = useState({})
  const [domainsContacts, setDomainsContacts] = useState(null)
  const [payersInfo, setPayersInfo] = useState({})

  const { state } = location

  useEffect(() => {
    if (state?.domainInfo) {
      dispatch(
        domainsOperations.getDomainsContacts({
          setDomains: setDomainsContacts,
          body: state?.domainInfo,
          signal,
          setIsLoading,
        }),
      )
    }
  }, [])

  useEffect(() => {
    if (
      formData?.ownerForm?.validated &&
      formData?.adminForm?.validated &&
      formData?.billForm?.validated &&
      formData?.techForm?.validated
    ) {
      const values = {
        ...formData?.ownerForm?.values,
        ...formData?.adminForm?.values,
        ...formData?.billForm?.values,
        ...formData?.techForm?.values,
      }
      setContactsHandler(values)
      setFormData({})
    }
  }, [formData])

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  const setContactsHandler = values => {
    const data = { ...values, ...state?.domainInfo, period: '12', snext: 'ok', sok: 'ok' }
    dispatch(
      domainsOperations.getDomainsContacts({
        setDomains: setDomainsContacts,
        body: data,
        navigate,
        transfer,
        signal,
        setIsLoading,
      }),
    )
  }

  const ownerFormRef = useRef()
  const adminFormRef = useRef()
  const techFormRef = useRef()
  const billFormRef = useRef()

  async function handleSubmit() {
    await ownerFormRef.current.Submit()
    await adminFormRef.current.Submit()
    await techFormRef.current.Submit()
    await billFormRef.current.Submit()
  }

  function handleChangeForm(data, type) {
    setFormData({ ...formData, [`${type}Form`]: data })
  }

  if (!state?.domainInfo) {
    return <Navigate replace to={route.DOMAINS_ORDERS} />
  }

  const refHandler = type => {
    switch (type) {
      case 'owner':
        return ownerFormRef
      case 'admin':
        return adminFormRef
      case 'tech':
        return techFormRef
      case 'bill':
        return billFormRef
    }
  }

  return (
    <>
      <div className={s.page_wrapper}>
        <BreadCrumbs pathnames={parseLocations()} />
        {domainsContacts &&
          formTypes?.map(type => {
            return (
              <DomainContactInfoItem
                key={type}
                onChange={data => handleChangeForm(data, type)}
                domainInfo={state?.domainInfo}
                formType={type}
                refId={refHandler(type)}
                domainsContacts={domainsContacts}
                setDomainsContacts={setDomainsContacts}
                setPayersInfo={setPayersInfo}
                payersInfo={payersInfo}
                signal={signal}
                setIsLoading={setIsLoading}
              />
            )
          })}

        {domainsContacts && (
          <div className={s.btnBlock}>
            <Button
              className={s.saveBtn}
              isShadow
              size="medium"
              label={t('Proceed', { ns: 'other' })}
              type="button"
              onClick={handleSubmit}
            />
            <button
              onClick={() =>
                navigate(route.DOMAINS, {
                  replace: true,
                })
              }
              type="button"
              className={s.cancel}
            >
              {t('Cancel', { ns: 'other' })}
            </button>
          </div>
        )}
      </div>

      {isLoading && <Loader local shown={isLoading} />}
    </>
  )
}
