import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { ErrorMessage } from 'formik'
import cn from 'classnames'
import { useDispatch } from 'react-redux'

import { Icon } from '../Icon'
import { authOperations } from '../../Redux/auth/authOperations'
import s from './SelectOfCountries.module.scss'

export function SelectOfCountries() {
  const tabletOrHigher = useMediaQuery({ query: '(min-width: 768px)' })
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [countries, setCountries] = useState([])
  const [countriesOpened, setCountriesOpened] = useState(false)
  console.log(
    countries.map(el => {
      return el
    }),
  )

  useEffect(() => {
    dispatch(authOperations.getCountries(setCountries))
  }, [dispatch])

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
            {countries.map(({ $key, $image, $ }) => {
              console.log('1', $image)
              console.log('1', $)
              const countryCode = $image.slice(-6, -4).toLowerCase()
              console.log(countryCode)

              return (
                <li className={s.country_item}>
                  <img
                    className={s.country_img}
                    src={require(`../../images/countryFlags/${countryCode}.png`)}
                    width={20}
                    height={14}
                    alt="flag"
                  />
                  <span className={s.country_name}>{$}</span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
