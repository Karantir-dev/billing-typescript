import { BreadCrumbs, PageTabBar } from '@components'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

import s from './DedicatedServersPage.module.scss'
import * as route from '@src/routes'

export default function DedicPage() {
  const { t } = useTranslation(['vds', 'container', 'other', 'dedicated_servers'])

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  const tavBarSections = [
    {
      route: `${route.DEDICATED_SERVERS}/dedicated`,
      label: t('burger_menu.services.services_list.dedicated', {
        ns: 'container',
      }),
      allowToRender: true,
      replace: true,
    },
    {
      route: `${route.DEDICATED_SERVERS}/vds`,
      label: 'VDS',
      allowToRender: true,
      replace: true,
    },
  ]

  return (
    <>
      <BreadCrumbs pathnames={parseLocations()} />
      <h2 className={s.page_title}>
        {t('burger_menu.services.services_list.dedicated_servers', { ns: 'container' })}
      </h2>
      <PageTabBar sections={tavBarSections} />
      <div className={s.content}>
        <Outlet />
      </div>
    </>
  )
}
