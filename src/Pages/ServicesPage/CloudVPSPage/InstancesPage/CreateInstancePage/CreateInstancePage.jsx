import { BreadCrumbs, Loader } from '@components'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { cloudVpsOperations } from '@src/Redux'
import { useCancelRequest } from '@src/utils'

// import s from './CreateInstancePage.module.scss'

export default function CreateInstancePage() {
  const location = useLocation()
  const dispatch = useDispatch()

  const { t } = useTranslation([])

  const { signal, isLoading, setIsLoading } = useCancelRequest()

  useEffect(() => {
    dispatch(cloudVpsOperations.getCloudOrderPageInfo({ signal, setIsLoading }))
  }, [])

  return (
    <div>
      <BreadCrumbs pathnames={location?.pathname.split('/')} />
      <h2 className="page_title">{t('create_instance', { ns: 'crumbs' })} </h2>
      <h3>{t('server_location')}</h3>
      <ul></ul>
      <h3>{t('server_image')}</h3>

      {isLoading && <Loader local shown={isLoading} />}
    </div>
  )
}
