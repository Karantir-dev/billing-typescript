import {
  BreadCrumbs,
  TooltipWrapper,
  Icon,
  Loader,
  InstancesOptions,
  PageTabBar,
} from '@components'
import { CloudInstanceItemProvider } from './CloudInstanceItemContext'
import { useLocation, useParams, Outlet, useNavigate } from 'react-router-dom'
import { cloudVpsActions, cloudVpsOperations, selectors } from '@redux'

import { useDispatch, useSelector } from 'react-redux'
import { getInstanceMainInfo, useCancelRequest, getImageIconName } from '@src/utils'
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
  const darkTheme = useSelector(selectors.getTheme) === 'dark'

  const { state: instanceItem } = location
  const navigate = useNavigate()
  const widerThan768 = useMediaQuery({ query: '(min-width: 768px)' })
  const [item, setItem] = useState(instanceItem)

  const { isResized, displayStatus, isSuspended } = getInstanceMainInfo(item)

  const { t } = useTranslation(['cloud_vps', 'crumbs'])

  const setItemData = ([item]) => {
    setItem(item)
    navigate({ state: item })
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

  const tabBarSections = [
    {
      route: `${route.CLOUD_VPS}/${params.id}`,
      label: t('info'),
      allowToRender: true,
      replace: true,
      end: true,
    },
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
    {
      route: `${route.CLOUD_VPS}/${params.id}/metrics`,
      label: t('metrics', { ns: 'crumbs' }),
      allowToRender: true,
      replace: true,
      end: true,
    },
    {
      route: `${route.CLOUD_VPS}/${params.id}/network_traffic`,
      label: t('network_traffic', { ns: 'crumbs' }),
      allowToRender: true,
      replace: true,
      end: true,
    },
    {
      route: `${route.CLOUD_VPS}/${params.id}/snapshots`,
      label: t('snapshots', { ns: 'crumbs' }),
      allowToRender: true,
      replace: true,
      end: true,
    },
    {
      route: `${route.CLOUD_VPS}/${params.id}/backups`,
      label: t('backups', { ns: 'crumbs' }),
      allowToRender: true,
      replace: true,
      end: true,
    },
  ]

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

  const isHintStatus = isSuspended || isResized
  const hintMessage = isResized ? t('resize_popup_text') : t('by_admin')

  const osIcon = getImageIconName(item?.os_distro?.$, darkTheme)

  return (
    <CloudInstanceItemProvider value={{ item }}>
      <div className={s.page}>
        <BreadCrumbs pathnames={parseLocations()} />
        <div className={s.head_coponent}>
          <div className={s.page_title_container}>
            <div>
              <div className={s.page_title_wrapper}>
                <h2 className={s.page_title}>{item?.servername?.$ || item?.name?.$}</h2>
                {osIcon && (
                  <TooltipWrapper className={s.popup} content={item.os_distro.$}>
                    <img
                      src={require(`@images/soft_os_icons/${osIcon}.png`)}
                      alt={item?.os_distro?.$}
                    />
                  </TooltipWrapper>
                )}
              </div>

              {isHintStatus ? (
                <TooltipWrapper className={s.popup} label={hintMessage}>
                  <span
                    className={cn(
                      s.status,
                      s[
                        item?.instance_status?.$.trim().toLowerCase() ||
                          item?.item_status?.$.trim().toLowerCase()
                      ],
                    )}
                  >
                    {displayStatus}
                    <Icon name="Attention" />
                  </span>
                </TooltipWrapper>
              ) : (
                <span
                  className={cn(
                    s.status,
                    s[
                      item.instance_status?.$.trim().toLowerCase() ||
                        item.item_status?.$.trim().toLowerCase()
                    ],
                  )}
                >
                  {displayStatus}
                </span>
              )}
            </div>
            <InstancesOptions
              item={item}
              buttonClassName={s.btn_wrapper}
              isMobile={!widerThan768}
              isTileLayout
            />
          </div>
        </div>

        <PageTabBar sections={tabBarSections} />

        <div className={s.page_content}>
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
        redirectCallback={() => navigate(route.CLOUD_VPS)}
      />
{/* 
      <ImagesModals
        loadingParams={{
          signal,
          setIsLoading,
        }}
      /> */}

      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </CloudInstanceItemProvider>
  )
}
