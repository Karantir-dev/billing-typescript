import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { ErrorMessage } from 'formik'
import cn from 'classnames'
import { useDispatch } from 'react-redux'

import { Icon } from '../Icon'
import { authOperations } from '../../Redux/auth/authOperations'
import s from './SelectOfCountries.module.scss'

export function SelectOfCountries({ setFieldValue }) {
  const tabletOrHigher = useMediaQuery({ query: '(min-width: 768px)' })
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [countrySearchQuery, setCountrySearchQuery] = useState('')
  const [stateSearchQuery, setStateSearchQuery] = useState('')

  const [countries, _setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const setCountries = value => {
    _setCountries(value)
    setFilteredCountries(value)
  }

  const [states, _setStates] = useState([])
  const [filteredStates, setFilteredStates] = useState([])
  const setStates = value => {
    _setStates(value)
    setFilteredStates(value)
  }
  const [countriesOpened, setCountriesOpened] = useState(false)

  useEffect(() => {
    dispatch(authOperations.getCountries(setCountries, setStates))
  }, [dispatch])

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

  const handleInputChange = (value, itemsList, callback) => {
    setCountrySearchQuery(value)
    filterItems(value, itemsList, callback)
  }

  return (
    <div className={s.field_wrapper}>
      <label className={s.label}>{t('country_label')}</label>
      <div className={s.input_wrapper}>
        <input
          className={cn({
            [s.input]: true,
            [s.pr]: true,
            // [s.error]: error && touched,
          })}
          name="country"
          type="text"
          value={countrySearchQuery}
          onChange={e =>
            handleInputChange(e.target.value, countries, setFilteredCountries)
          }
          placeholder={t('country_placeholder')}
          onFocus={() => {
            setCountriesOpened(true)
          }}
          onBlur={() => {
            setCountriesOpened(false)
          }}
        />
        {tabletOrHigher && (
          <Icon className={s.field_icon} name="search" width={18} height={19} />
        )}
        <div className={s.input_border}></div>

        <Icon
          className={cn({ [s.right_icon]: true, [s.opened]: countriesOpened })}
          name="shevron"
          width={13}
          height={9}
        ></Icon>
      </div>
      <ErrorMessage className={s.error_message} name="country" component="span" />

      {countriesOpened && (
        <div className={s.countries_dropdown}>
          <ul className={s.countries_list}>
            {filteredCountries.map(({ $key, $image, $: countryName }) => {
              const countryCode = $image.slice(-6, -4).toLowerCase()

              return (
                <li key={$key} className={s.country_item} onClick={() => {}}>
                  <img
                    className={s.country_img}
                    src={require(`../../images/countryFlags/${countryCode}.png`)}
                    width={20}
                    height={14}
                    alt="flag"
                  />
                  <span className={s.country_name}>{countryName}</span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
