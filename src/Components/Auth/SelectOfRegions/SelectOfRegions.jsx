import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import { ErrorMessage } from 'formik'
import { Icon } from '@components'
import s from '../SelectOfCountries/SignupSelects.module.scss'

export default function SelectOfRegions({
  currentRegions,
  filterItems,
  setFieldTouched,
  setFieldValue,
  errors,
  touched,
  geoStateId,
}) {
  const { t } = useTranslation('auth')

  const [regionSearchQuery, setRegionSearchQuery] = useState('')
  const [regionsListOpened, setRegionsListOpened] = useState(false)
  const [filteredRegions, setFilteredRegions] = useState(currentRegions)

  useEffect(() => {
    if (filteredRegions && geoStateId) {
      filteredRegions?.forEach(c => {
        if (c?.$key === geoStateId) {
          handleRegionClick(c?.$, c?.$key)
        }
      })
    }
  }, [filteredRegions, geoStateId])

  const handleRegionInputChange = value => {
    setRegionSearchQuery(value)

    setFieldValue('region', 0)
    filterItems(value, currentRegions, setFilteredRegions)
  }

  const handleRegionClick = (regionName, $key) => {
    setRegionSearchQuery(regionName)
    setFieldTouched('region')
    setFieldValue('region', +$key)
    setRegionsListOpened(false)
  }

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      setRegionsListOpened(false)
    }
  }

  return (
    <div className={s.field_wrapper}>
      <label className={s.label}>{t('region_label')}</label>
      <div className={s.input_wrapper}>
        <input
          className={cn({
            [s.input]: true,
            [s.pr]: true,
            [s.pl]: true,
            [s.error]: errors.region && touched.region,
          })}
          name="region"
          type="text"
          value={regionSearchQuery}
          placeholder={t('region_placeholder')}
          autoComplete="off"
          onChange={e => handleRegionInputChange(e.target.value)}
          onFocus={() => {
            setRegionsListOpened(true)
          }}
        />

        <Icon  name="Search" className={s.field_icon} />

        <div className={s.input_border}></div>
        <Icon name="Shevron"
          className={cn({ [s.right_icon]: true, [s.opened]: regionsListOpened })}
        />
      </div>
      <ErrorMessage className={s.error_message} name="region" component="span" />

      {regionsListOpened && (
        <>
          <div
            role="button"
            tabIndex={-1}
            onKeyDown={() => {}}
            className={s.backdrop}
            onClick={handleBackdropClick}
          ></div>
          <div className={s.countries_dropdown}>
            <ul className={s.countries_list}>
              {filteredRegions.map(({ $key, $: regionName }) => {
                return (
                  <li className={s.country_item} key={$key}>
                    <button
                      className={s.country_btn}
                      type="button"
                      onClick={() => handleRegionClick(regionName, $key)}
                    >
                      {regionName}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
