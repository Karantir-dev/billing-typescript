import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ErrorMessage } from 'formik'
import cn from 'classnames'
import { useDispatch } from 'react-redux'
import { authOperations } from '../../Redux/auth/authOperations'
import { Shevron, Search } from '../../images'
import s from './SelectOfCountries.module.scss'

export default function SelectOfCountries({
  setFieldValue,
  validateField,
  setFieldTouched,
  errors,
  touched,
}) {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [countrySearchQuery, setCountrySearchQuery] = useState('')
  const [regionSearchQuery, setRegionSearchQuery] = useState('')

  const [countries, _setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const setCountries = value => {
    _setCountries(value)
    setFilteredCountries(value)
  }

  const [regions, _setRegions] = useState([])
  const [currentRegions, setCurrentRegions] = useState([])
  const [filteredregions, setFilteredRegions] = useState([])
  const setRegions = value => {
    _setRegions(value)
    setFilteredRegions(value)
  }
  const [countriesListOpened, setCountriesListOpened] = useState(false)
  const [regionsListOpened, setRegionsListOpened] = useState(false)
  const [currentFlag, setCurrentFlag] = useState('')

  useEffect(() => {
    dispatch(authOperations.getCountries(setCountries, setRegions))
  }, [dispatch])

  const countriesWithRegions = regions.reduce((acc, { $depend }) => {
    if (acc.includes($depend)) {
      return acc
    }
    acc.push($depend)
    return acc
  }, [])

  const filterItems = (query, itemsList, callback) => {
    if (query === '') {
      callback(itemsList)
      return
    }

    const filteredItems = itemsList.filter(({ $: countryName }) =>
      countryName.toLowerCase().includes(query.toLowerCase()),
    )

    if (filteredItems.length === 0) {
      callback(itemsList)
      return
    }
    callback(filteredItems)
  }

  const handleCountryInputChange = (value, itemsList, callback) => {
    setCountrySearchQuery(value)
    setCurrentFlag('')
    setFieldValue('country', 0)
    filterItems(value, itemsList, callback)
  }

  const handleRegionInputChange = (value, itemsList, callback) => {
    setRegionSearchQuery(value)

    setFieldValue('region', 0)
    filterItems(value, itemsList, callback)
  }

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      setCountriesListOpened(false)
      setRegionsListOpened(false)
    }
  }

  const handleCountryClick = (countryCode, countryName, $key) => {
    setCurrentFlag(countryCode)
    setCountrySearchQuery(countryName)
    setFieldValue('country', +$key)

    setCountriesListOpened(false)

    if (countriesWithRegions.includes($key)) {
      const activeRegions = regions.filter(({ $depend }) => $depend === $key)
      setCurrentRegions(activeRegions)
    } else {
      setCurrentRegions([])
    }
  }

  const handleRegionClick = (regionName, $key) => {
    setRegionSearchQuery(regionName)
    setFieldValue('region', +$key)
    setRegionsListOpened(false)
  }

  return (
    <>
      <div className={s.field_wrapper}>
        <label className={s.label}>{t('country_label')}</label>
        <div className={s.input_wrapper}>
          <input
            className={cn({
              [s.input]: true,
              [s.pr]: true,
              [s.pl]: true,
              [s.error]: errors.country && touched.country,
            })}
            name="country"
            type="text"
            value={countrySearchQuery}
            placeholder={t('country_placeholder')}
            autoComplete="off"
            onChange={e =>
              handleCountryInputChange(e.target.value, countries, setFilteredCountries)
            }
            onFocus={() => {
              setCountriesListOpened(true)
            }}
            onBlur={() => {
              setFieldTouched('country')
              validateField('country')
            }}
          />

          {currentFlag ? (
            <img
              className={s.field_icon}
              src={require(`../../images/countryFlags/${currentFlag}.png`)}
              width={20}
              height={14}
              alt="flag"
            />
          ) : (
            <Icon className={s.field_icon} name="search" width={18} height={19} />
          )}

          <div className={s.input_border}></div>

          <Icon
            className={cn({ [s.right_icon]: true, [s.opened]: countriesListOpened })}
            name="shevron"
            width={13}
            height={9}
          ></Icon>
        </div>
        <ErrorMessage className={s.error_message} name="country" component="span" />

        {countriesListOpened && (
          <>
            <div className={s.backdrop} onClick={handleBackdropClick}></div>
            <div className={s.countries_dropdown}>
              <ul className={s.countries_list}>
                {filteredCountries.map(({ $key, $image, $: countryName }) => {
                  const countryCode = $image.slice(-6, -4).toLowerCase()

                  return (
                    <li className={s.country_item} key={$key}>
                      <button
                        className={s.country_btn}
                        type="button"
                        onClick={() => handleCountryClick(countryCode, countryName, $key)}
                      >
                        <img
                          className={s.country_img}
                          src={require(`../../images/countryFlags/${countryCode}.png`)}
                          width={20}
                          height={14}
                          alt="flag"
                        />
                        <span className={s.country_name}>{countryName}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </>
        )}
      </div>

      {currentRegions.length > 0 && (
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
              onChange={e =>
                handleRegionInputChange(
                  e.target.value,
                  currentRegions,
                  setFilteredRegions,
                )
              }
              onFocus={() => {
                setRegionsListOpened(true)
              }}
              onBlur={() => {
                setFieldTouched('region')
                validateField('region')
              }}
            />

            <Icon className={s.field_icon} name="search" width={18} height={19} />

            <div className={s.input_border}></div>

            <Icon
              className={cn({ [s.right_icon]: true, [s.opened]: regionsListOpened })}
              name="shevron"
              width={13}
              height={9}
            ></Icon>
          </div>
          <ErrorMessage className={s.error_message} name="region" component="span" />

          {regionsListOpened && (
            <>
              <div className={s.backdrop} onClick={handleBackdropClick}></div>
              <div className={s.countries_dropdown}>
                <ul className={s.countries_list}>
                  {filteredregions.map(({ $key, $: regionName }) => {
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
      )}
    </>
  )
}
