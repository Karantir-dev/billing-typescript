/* eslint-disable no-unused-vars */
import {
  BreadCrumbs,
  PageTabBar,
  HintWrapper,
  Icon,
  Loader,
  Options,
  Button,
} from '@components'
import { useLocation, useParams, Outlet, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cloudVpsActions, cloudVpsOperations, cloudVpsSelectors } from '@redux'

import { useDispatch, useSelector } from 'react-redux'
import { useCancelRequest } from '@src/utils'
import { Modals } from '@components/Services/Instances/Modals/Modals'

import s from './CloudInstanceItemPage.module.scss'
import cn from 'classnames'
import * as route from '@src/routes'

export default function CloudInstanceItemPage() {
  const { t } = useTranslation(['cloud_vps', 'container', 'other'])
  const { signal, isLoading, setIsLoading } = useCancelRequest()

  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()
  const dispatch = useDispatch()

  const { state: item } = location

  const itemForModals = useSelector(cloudVpsSelectors.getItemForModals)

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  const tavBarSections = [
    {
      route: `${route.CLOUD_VPS}/${params.id}`,
      label: 'Info',
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
    // {
    //   route: `${route.CLOUD_VPS}/${params.id}/metrics`,
    //   label: 'Metrics',
    //   allowToRender: true,
    //   replace: true,
    //   end: true,
    // },
  ]

  const isNotActive =
    item.status.$ === '1' || item.status.$ === '4' || item.status.$ === '5'

  const isStopped = item.item_status.$orig === '2_2_16'

  const options = [
    {
      label: t(isStopped ? 'Start' : 'Shut down'),
      icon: 'Shutdown',
      onClick: () =>
        dispatch(
          cloudVpsActions.setItemForModals({
            confirm: { ...item, confirm_action: isStopped ? 'start' : 'stop' },
          }),
        ),
      disabled: isNotActive,
    },
    {
      label: t('Console'),
      icon: 'Console',
      disabled: isNotActive,
      onClick: () => dispatch(cloudVpsOperations.openConsole({ elid: item.id.$ })),
    },
    {
      label: t('Reboot'),
      icon: 'Reboot',
      disabled: isNotActive,
      onClick: () =>
        dispatch(
          cloudVpsActions.setItemForModals({
            confirm: { ...item, confirm_action: 'reboot' },
          }),
        ),
    },
    {
      label: t('Resize'),
      icon: 'Resize',
      disabled: isNotActive || item.change_pricelist?.$ === 'off',
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ resize: item })),
    },

    {
      label: t('Change password'),
      icon: 'ChangePassword',
      disabled: isNotActive,
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ change_pass: item })),
    },
    {
      label: t('Rescue'),
      icon: 'Rescue',
      disabled: isNotActive,
      onClick: () =>
        dispatch(
          cloudVpsActions.setItemForModals({
            rebuild: { ...item, rebuild_action: 'bootimage' },
          }),
        ),
    },
    {
      label: t('Instructions'),
      icon: 'Instruction',
      disabled: isNotActive,
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ instruction: item })),
    },
    {
      label: t('Rebuild'),
      icon: 'Rebuild',
      disabled: isNotActive,
      onClick: () =>
        dispatch(
          cloudVpsActions.setItemForModals({
            rebuild: { ...item, rebuild_action: 'rebuild' },
          }),
        ),
    },
    {
      label: t('Create ticket'),
      icon: 'Headphone',
      onClick: () =>
        navigate(`${route.SUPPORT}/requests`, {
          state: { id: item.id.$, openModal: true },
        }),
    },
    {
      label: t('Rename'),
      icon: 'Rename',
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ edit_name: item })),
    },
    {
      label: t('Delete'),
      icon: 'Remove',
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ delete: item })),
      isDelete: true,
    },
  ]

  const editInstanceHandler = ({ values, elid, closeModal, errorCallback }) => {
    dispatch(
      cloudVpsOperations.editInstance({
        values,
        elid,
        errorCallback,
        closeModal,
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

  const deleteInstanceSubmit = () => {
    dispatch(
      cloudVpsOperations.deleteInstance({
        elid: itemForModals.delete.id.$,
        closeModal: () => dispatch(cloudVpsActions.setItemForModals({ delete: false })),
      }),
    )
  }

  const confirmInstanceSubmit = (action, elid) => {
    dispatch(
      cloudVpsOperations.changeInstanceState({
        action,
        elid,
        closeModal: () => dispatch(cloudVpsActions.setItemForModals({ confirm: false })),
      }),
    )
  }

  const changeInstancePasswordSubmit = password => {
    dispatch(
      cloudVpsOperations.changeInstancePassword({
        password,
        elid: itemForModals.change_pass.id.$,
        closeModal: () =>
          dispatch(cloudVpsActions.setItemForModals({ change_pass: false })),
        signal,
        setIsLoading,
      }),
    )
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

            <Options options={options} columns={2} buttonClassName={s.btn_wrapper} />
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
            {item.fotbo_status?.$?.replaceAll('_', ' ') || item.item_status?.$}
          </span>
        </div>

        {/* Commented until only one tab exist: */}
        {/* <PageTabBar sections={tavBarSections} /> */}

        <div className={s.content}>
          <Outlet />
        </div>
      </div>

      <Modals
        deleteInstanceSubmit={deleteInstanceSubmit}
        changeInstancePasswordSubmit={changeInstancePasswordSubmit}
        editNameSubmit={editNameSubmit}
        confirmSubmit={confirmInstanceSubmit}
        resizeSubmit={() => {}}
      />
      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </>
  )
}
