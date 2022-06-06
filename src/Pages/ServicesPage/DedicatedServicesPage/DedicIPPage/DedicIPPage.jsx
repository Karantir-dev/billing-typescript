import React, { useEffect, useState } from 'react'
// import { useDispatch } from 'react-redux'
import { BreadCrumbs, Button, HintWrapper, IconButton } from '../../../../Components'
import { useLocation } from 'react-router-dom'

import s from './DedicIPPage.module.scss'
import dedicOperations from '../../../../Redux/dedicatedServers/dedicOperations'
import { useDispatch } from 'react-redux'
import DedicIPList from '../../../../Components/Services/DedicatedServers/DedicIP/DedicIPList/DedicIPList'
// import { Delete, Settings } from '../../../../images'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'

export default function DedicIPpage() {
  const location = useLocation()

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  const dispatch = useDispatch()
  const [IPList, setIPList] = useState([])
  const [activeIP, setActiveIP] = useState(null)
  const widerThan1550 = useMediaQuery({ query: '(min-width: 1550px)' })

  const { t } = useTranslation(['dedicated_servers', 'other', 'crumbs'])

  useEffect(() => {
    dispatch(dedicOperations.getIPList('3568378', setIPList)) // to get ID
  }, [])

  return (
    <div className={s.page_container}>
      <BreadCrumbs pathnames={parseLocations()} />

      <h3 className={s.ip_title}>{t('ip', { ns: 'crumbs' })}</h3>

      <div className={s.tools_wrapper}>
        {widerThan1550 && (
          <div>
            <HintWrapper label={t('edit', { ns: 'other' })}>
              <IconButton
                className={s.tools_icon}
                onClick={() => null}
                disabled={!activeIP}
                icon="settings"
              />
            </HintWrapper>
            <HintWrapper label={t('delete')}>
              <IconButton
                className={s.tools_icon}
                disabled={activeIP?.no_delete?.$ === 'on'}
                icon="delete"
              />
            </HintWrapper>
          </div>
        )}

        <div>
          <Button
            className={s.order_btn}
            isShadow
            type="button"
            label={t('to_order', { ns: 'other' }).toUpperCase()}
            onClick={() => null}
          />
        </div>
      </div>

      <DedicIPList IPList={IPList} setActiveIP={setActiveIP} activeIP={activeIP} />
    </div>
  )
}
