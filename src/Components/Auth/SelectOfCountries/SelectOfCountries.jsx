import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ErrorMessage } from 'formik'
import cn from 'classnames'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import { Shevron, Search } from '../../../images'
import { SelectOfRegions } from '../../'
import { authOperations } from '../../../Redux'
import s from './SignupSelects.module.scss'

export default function SelectOfCountries({
  setErrMsg,
  setFieldValue,
  setFieldTouched,
  errors,
  touched,
  // setSocialLinks,
}) {
  const { t } = useTranslation('auth')
  const dispatch = useDispatch()

  const [countrySearchQuery, setCountrySearchQuery] = useState('')
  const [countriesListOpened, setCountriesListOpened] = useState(false)
  const [currentFlag, setCurrentFlag] = useState('')

  const [countries, _setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const setCountries = value => {
    _setCountries(value)
    setFilteredCountries(value)
  }

  const [regions, setRegions] = useState([])
  const [currentRegions, setCurrentRegions] = useState([])

  useEffect(() => {
    dispatch(
      authOperations.getCountriesForRegister(
        setCountries,
        setRegions,
        setErrMsg,
        // setSocialLinks,
      ),
    )
  }, [])

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

  const handleCountryInputChange = value => {
    setCountrySearchQuery(value)
    setCurrentFlag('')
    setFieldValue('country', 0)
    filterItems(value, countries, setFilteredCountries)
  }

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      setCountriesListOpened(false)
    }
  }

  const handleCountryClick = (countryCode, countryName, $key) => {
    setCurrentFlag(countryCode)
    setCountrySearchQuery(countryName)
    setFieldTouched('country')
    setFieldValue('country', +$key)

    setCountriesListOpened(false)

    if (countriesWithRegions.includes($key)) {
      const activeRegions = regions.filter(({ $depend }) => $depend === $key)
      setCurrentRegions(activeRegions)
    } else {
      setCurrentRegions([])
    }
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
            onChange={e => handleCountryInputChange(e.target.value)}
            onFocus={() => {
              setCountriesListOpened(true)
            }}
          />

          {currentFlag ? (
            <img
              className={s.field_icon}
              src={require(`../../../images/countryFlags/${currentFlag}.png`)}
              width={20}
              height={14}
              alt="flag"
            />
          ) : (
            <Search className={s.field_icon} />
          )}

          <div className={s.input_border}></div>
          <Shevron
            className={cn({ [s.right_icon]: true, [s.opened]: countriesListOpened })}
          />
        </div>
        <ErrorMessage className={s.error_message} name="country" component="span" />

        {countriesListOpened && (
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
                          src={require(`../../../images/countryFlags/${countryCode}.png`)}
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
        <SelectOfRegions
          currentRegions={currentRegions}
          filterItems={filterItems}
          setFieldTouched={setFieldTouched}
          setFieldValue={setFieldValue}
          errors={errors}
          touched={touched}
        />
      )}
    </>
  )
}

SelectOfCountries.propTypes = {
  setErrMsg: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
}
