import { BreadCrumbs, Loader } from '@components'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { cloudVpsOperations } from '@src/Redux'
import { getFlagFromCountryName, useCancelRequest } from '@src/utils'

import s from './CreateInstancePage.module.scss'
import cn from 'classnames'

export default function CreateInstancePage() {
  const location = useLocation()
  const dispatch = useDispatch()

  const { t } = useTranslation([])

  const [dcList, setDcList] = useState()
  const [currentDC, setCurrentDC] = useState()

  const { signal, isLoading, setIsLoading } = useCancelRequest()

  useEffect(() => {
    dispatch(
      cloudVpsOperations.getCloudOrderPageInfo({ signal, setIsLoading, setDcList }),
    )
  }, [])

  return (
    <div>
      <BreadCrumbs pathnames={location?.pathname.split('/')} />
      <h2 className="page_title">{t('create_instance', { ns: 'crumbs' })} </h2>
      <h3 className={s.section_title}>{t('server_location')}</h3>

      <ul className={s.categories_list}>
        {dcList?.map(({ $key, $ }) => {
          return (
            <li
              className={cn(s.category_item, { [s.selected]: currentDC === $key })}
              key={$key}
            >
              <button
                className={cn(s.category_btn)}
                type="button"
                onClick={() => setCurrentDC($key)}
              >
                <img
                  className={s.flag}
                  src={require(`@images/countryFlags/${getFlagFromCountryName(
                    $.replace('Fotbo ', ''),
                  )}.png`)}
                  width={20}
                  height={14}
                  alt={$.replace('Fotbo ', '')}
                />
                {t($)}
              </button>
            </li>
          )
        })}
      </ul>

      <h3 className={s.section_title}>{t('server_image')}</h3>

      {isLoading && <Loader local shown={isLoading} />}
    </div>
  )
}
