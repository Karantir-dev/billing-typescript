import usePlacesAutocomplete from 'use-places-autocomplete'
import { useOutsideAlerter } from '@utils'
import { useRef, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import s from '../InputField/InputField.module.scss'
import ss from './InputWithAutocomplete.module.scss'
import { useSelector } from 'react-redux'
import { authSelectors } from '@redux'
import { ErrorMessage, Field } from 'formik'
import { Icon, TooltipWrapper } from '@components'

let cachedVal = ''
const acceptedKeys = ['ArrowUp', 'ArrowDown', 'Escape', 'Enter']

export default function InputWithAutocomplete({
  fieldName,
  externalValue,
  error,
  touched,
  setFieldValue,
  inputClassName,
  infoText,
  ...props
}) {
  const { t, i18n } = useTranslation(['other'])
  const [isFocused, setIsFocused] = useState(false)
  const [currIndex, setCurrIndex] = useState()
  const geoData = useSelector(authSelectors.getGeoData)

  const {
    ready,
    // value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: {
        country: geoData?.clients_country_code || '',
      },
      types: ['route', 'premise', 'street_address', 'street_number'],
    },
    callbackName: 'initMap',
    language: i18n.language,
    debounce: 300,
  })

  useEffect(() => {
    const scriptEl = document.querySelector('[data-google-script]')
    if (!scriptEl) {
      let script = document.createElement('script')
      script.src =
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyDmn43GdPCBuZpFkIsWkFpU__Ycd1qusZE&libraries=places&callback=initMap'
      script.setAttribute('data-google-script', true)
      document.body.appendChild(script)
    }
  }, [])

  const hasSuggestions = status === 'OK'
  const uniqueResults = data.reduce((acc, el) => {
    const {
      structured_formatting: { main_text },
    } = el
    if (!acc.some(el => el.structured_formatting.main_text === main_text)) {
      acc.push(el)
    }

    return acc
  }, [])

  const dismissSuggestions = () => {
    setCurrIndex(null)
    clearSuggestions()
  }

  const ref = useRef(null)
  useOutsideAlerter(ref, hasSuggestions, dismissSuggestions)

  const handleInput = e => {
    setValue(e.target.value)
    cachedVal = e.target.value
    setFieldValue(e.target.value)
  }

  const handleEnter = idx => () => {
    setCurrIndex(idx)
  }

  const handleLeave = () => {
    setCurrIndex(null)
  }

  const handleSelect = value => () => {
    setValue(value, false)
    setFieldValue(value)
    dismissSuggestions()

    // Get latitude and longitude via utility functions
    // getGeocode({ address: value }).then(results => {
    //   const { lat, lng } = getLatLng(results[0])

    // })
  }

  const handleKeyDown = e => {
    if (!hasSuggestions || !acceptedKeys.includes(e.key)) return

    if (e.key === 'Enter' || e.key === 'Escape') {
      dismissSuggestions()
      return
    }

    let nextIndex

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      nextIndex = currIndex ?? uniqueResults.length
      nextIndex = nextIndex && nextIndex > 0 ? nextIndex - 1 : null
    } else {
      nextIndex = currIndex ?? -1
      nextIndex = nextIndex < uniqueResults.length - 1 ? nextIndex + 1 : null
    }

    setCurrIndex(nextIndex)

    setValue(
      uniqueResults[nextIndex]
        ? uniqueResults[nextIndex].structured_formatting.main_text
        : cachedVal,
      false,
    )
    setFieldValue(
      uniqueResults[nextIndex]
        ? uniqueResults[nextIndex].structured_formatting.main_text
        : cachedVal,
    )
  }

  const renderSuggestions = () => {
    return uniqueResults.map((suggestion, idx) => {
      const {
        place_id,
        structured_formatting: { main_text },
      } = suggestion

      return (
        <li key={place_id} onMouseEnter={handleEnter(idx)}>
          <button
            className={cn(ss.suggestion_btn, idx === currIndex && ss.active)}
            type="button"
            onClick={handleSelect(main_text)}
          >
            <span className={ss.suggestion_main_text}>{main_text}</span>{' '}
            {/* <small>{secondary_text}</small> */}
          </button>
        </li>
      )
    })
  }

  return (
    <div ref={ref}>
      <div className={s.field_wrapper}>
        <label htmlFor={fieldName} className={s.label}>
          {t('The address', { ns: 'other' })}: <span className={s.required_star}>*</span>
        </label>

        <div
          className={cn(s.input_wrapper, {
            [s.focused]: isFocused,
          })}
        >
          <Field
            className={cn(
              {
                [s.input]: true,
                [s.shadow]: true,
                [ss.pr35]: true,
                [s.error]: error && touched,
                [s.disabled]: !ready,
              },
              inputClassName,
            )}
            id={fieldName}
            name={fieldName}
            value={externalValue}
            disabled={!ready}
            onChange={handleInput}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            type="text"
            placeholder={t('Enter address', { ns: 'other' })}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck="false"
            {...props}
          />
          {infoText && (
            <TooltipWrapper
              wrapperClassName={s.infoBtn}
              className={ss.adressHint}
              content={infoText}
              place="top-end"
            >
              <Icon name="Info" />
            </TooltipWrapper>
          )}
        </div>

        <ErrorMessage className={s.error_message} name={fieldName} component="span" />
      </div>

      {hasSuggestions && (
        <div className={ss.dropdown_wrapper}>
          <ul className={ss.dropdown} onMouseLeave={handleLeave}>
            {renderSuggestions()}
          </ul>
        </div>
      )}
    </div>
  )
}
