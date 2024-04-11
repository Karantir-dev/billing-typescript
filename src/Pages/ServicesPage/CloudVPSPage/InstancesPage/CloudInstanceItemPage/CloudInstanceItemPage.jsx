import { BreadCrumbs, HintWrapper, Icon, Loader, InstancesOptions } from '@components'
import { useLocation, useParams, Outlet, useNavigate } from 'react-router-dom'
import { cloudVpsActions, cloudVpsOperations } from '@redux'

import { useDispatch } from 'react-redux'
import { getInstanceMainInfo, useCancelRequest } from '@src/utils'
import { Modals } from '@components/Services/Instances/Modals/Modals'

import s from './CloudInstanceItemPage.module.scss'
import cn from 'classnames'
import * as route from '@src/routes'
import { useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useTranslation } from 'react-i18next'

export default function CloudInstanceItemPage() {
  const { signal, isLoading, setIsLoading } = useCancelRequest()

  const location = useLocation()
  const params = useParams()
  const dispatch = useDispatch()
  const interval = useRef()

  const { state: instanceItem } = location
  const navigate = useNavigate()
  const widerThan768 = useMediaQuery({ query: '(min-width: 768px)' })

  const [item, setItem] = useState(instanceItem)

  const { isResized, displayStatus } = getInstanceMainInfo(item)

  const { t } = useTranslation(['cloud_vps'])

  const setItemData = ([item]) => {
    setItem(item)
    navigate(`${route.CLOUD_VPS}/${params.id}`, { state: item })
  }

  const fetchItemById = () => {
    dispatch(
      cloudVpsOperations.setInstancesFilter({
        values: { id: params.id },
        successCallback: () =>
          dispatch(
            cloudVpsOperations.getInstances({
              setLocalInstancesItems: setItemData,
              signal,
              setIsLoading,
            }),
          ),
      }),
    )
  }

  useEffect(() => {
    if (!item) {
      fetchItemById()
    }

    return () => {
      location.state = null
      dispatch(cloudVpsActions.setInstancesFilters({}))
    }
  }, [])

  useEffect(() => {
    if (item) {
      const isProcessing = getInstanceMainInfo(item).isProcessing

      interval.current =
        isProcessing &&
        setInterval(() => {
          fetchItemById(params.id)
        }, 10000)
    }

    return () => {
      clearInterval(interval.current)
    }
  }, [item])

  if (!item) {
    return <Loader local shown halfScreen />
  }

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  // const tavBarSections = [
  //   {
  //     route: `${route.CLOUD_VPS}/${params.id}`,
  //     label: 'Info',
  //     allowToRender: true,
  //     replace: true,
  //     end: true,
  //   },
  // {
  //   route: `${route.CLOUD_VPS}/${params.id}/networking`,
  //   label: 'Networking',
  //   allowToRender: true,
  //   replace: true,
  //   end: true,
  // },
  // {
  //   route: `${route.CLOUD_VPS}/${params.id}/system_log`,
  //   label: 'System log',
  //   allowToRender: true,
  //   replace: true,
  //   end: true,
  // },
  // {
  //   route: `${route.CLOUD_VPS}/${params.id}/metrics`,
  //   label: 'Metrics',
  //   allowToRender: true,
  //   replace: true,
  //   end: true,
  // },
  // ]

  const editInstanceHandler = ({ values, elid, closeModal, errorCallback }) => {
    dispatch(
      cloudVpsOperations.editInstance({
        values,
        elid,
        errorCallback,
        closeModal,
        successCallback: () => fetchItemById(),
        signal,
        setIsLoading,
      }),
    )
  }

  const editNameSubmit = ({ value, elid, closeModal, errorCallback }) => {
    editInstanceHandler({
      values: { servername: value },
      elid,
      closeModal,
      errorCallback,
    })
  }

  return (
    <>
      <div className={s.page}>
        <BreadCrumbs pathnames={parseLocations()} />
        <div className={s.head_coponent}>
          <div className={s.page_title_container}>
            <div className={s.page_title_wrapper}>
              <h2 className={s.page_title}>{item?.servername?.$ || item?.name?.$}</h2>
              <HintWrapper
                popupClassName={s.popup}
                wrapperClassName={s.popup__wrapper}
                label={item.instances_os.$}
              >
                <Icon name={item.instances_os.$.split(/[\s-]+/)[0]} />
              </HintWrapper>
            </div>
            <InstancesOptions
              item={item}
              buttonClassName={s.btn_wrapper}
              isMobile={!widerThan768}
            />
          </div>

          <span
          className={cn(
            s.status,
            s[
              item.fotbo_status?.$.trim().toLowerCase() ||
                item.item_status?.$.trim().toLowerCase()
            ],
          )}
        >
          {displayStatus}
          {isResized && (
            <HintWrapper
              popupClassName={s.popup}
              wrapperClassName={s.popup__wrapper}
              label={t('resize_popup_text')}
            >
              <Icon name="Attention" />
            </HintWrapper>
          )}
        </span>

        </div>

        {/* Commented until only one tab exist: */}
        {/* <PageTabBar sections={tavBarSections} /> */}

        <div className={s.content}>
          <Outlet />
        </div>
      </div>

      <Modals
        editNameSubmit={editNameSubmit}
        loadingParams={{
          signal,
          setIsLoading,
        }}
        getInstances={fetchItemById}
        redirectCallback={() => navigate(`${route.CLOUD_VPS}/${item.id.$}`)}
      />
      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </>
  )
}