/* eslint-disable no-unused-vars */
import { BreadCrumbs, PageTabBar, HintWrapper, Icon, Options } from '@components'
import { useLocation, useParams, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cloudVpsActions } from '@redux'
import { useDispatch } from 'react-redux'

import s from './CloudInstanceItemPage.module.scss'
import cn from 'classnames'
import * as route from '@src/routes'

export default function CloudInstanceItemPage() {
  const { t } = useTranslation(['vds', 'container', 'other', 'dedicated_servers'])
  const location = useLocation()
  const params = useParams()
  const dispatch = useDispatch()

  const { state: item } = location

  console.log('Item with opened Instance Page: ', item)

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
      label: isStopped ? 'Start' : 'Shut down',
      icon: 'Shutdown',
      onClick: () =>
        dispatch(
          cloudVpsActions.setItemForModals({
            confirm: { ...item, confirm_action: isStopped ? 'start' : 'stop' },
          }),
        ),
      disabled: item.item_status.$.includes('in progress') || isNotActive,
    },
    {
      label: 'Console',
      icon: 'Console',
      disabled: isNotActive,
      onClick: () => {},
    },
    {
      label: 'Reboot',
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
      label: 'Shelve',
      icon: 'Shelve',
      disabled: isNotActive,
      onClick: () => {},
    },
    {
      label: 'Resize',
      icon: 'Resize',
      disabled: isNotActive,
      onClick: () => {},
    },

    {
      label: 'Change password',
      icon: 'ChangePassword',
      disabled: isNotActive,
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ change_pass: item })),
    },
    {
      label: 'Rescue',
      icon: 'Rescue',
      disabled: isNotActive,
      onClick: () => {},
    },
    {
      label: 'Instructions',
      icon: 'Instruction',
      disabled: isNotActive,
      onClick: () => {},
    },
    {
      label: 'Rebuild',
      icon: 'Rebuild',
      disabled: isNotActive,
      onClick: () => {},
    },
    {
      label: 'Create ticket',
      icon: 'Headphone',
      disabled: isNotActive,
      onClick: () => {},
    },
    {
      label: 'Rename',
      icon: 'Rename',
      disabled: isNotActive,
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ edit_name: item })),
    },
    {
      label: 'Delete',
      icon: 'Remove',
      disabled: false,
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ delete: item })),
      isDelete: true,
    },
  ]

  return (
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

          <Options options={options} columns={2} />
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
      <PageTabBar sections={tavBarSections} />

      <div className={s.content}>
        <Outlet />
      </div>
    </div>
  )
}
