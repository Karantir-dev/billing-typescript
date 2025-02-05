import { BreadCrumbs, PageTabBar } from '@components'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

import s from './CloudVPS.module.scss'
import * as route from '@src/routes'

export default function DedicPage() {
  const { t } = useTranslation(['crumbs', 'container'])

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  const tabBarSections = [
    {
      route: route.CLOUD_VPS,
      label: t('Instances'),
      allowToRender: true,
      replace: true,
      end: true,
    },
    {
      route: route.CLOUD_VPS_SSH_KEYS,
      label: t('ssh_keys'),
      allowToRender: true,
      replace: true,
      end: true,
    },
    {
      route: route.CLOUD_VPS_IMAGES,
      label: t('images'),
      allowToRender: true,
      replace: true,
      end: true,
    },
  ]

  return (
    <div className={s.page}>
      <BreadCrumbs pathnames={parseLocations()} />
      <h2 className={s.page_title}>
        {t('burger_menu.services.services_list.cloud_vps', { ns: 'container' })}
      </h2>
      <PageTabBar sections={tabBarSections} />
      <div className={s.content}>
        <Outlet />
      </div>
    </div>
  )
}
