import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import { payersSelectors, authSelectors, payersOperations } from '../../../Redux'
import { BASE_URL } from '../../../config/config'

import { Select } from '../..'

const geoImgURL = `${BASE_URL}/manimg/common/flag/`

export default function SelectGeo(props) {
  let { setSelectFieldValue, selectValue, selectClassName, countrySelectClassName } =
    props

  const dispatch = useDispatch()
  const geoData = useSelector(authSelectors.getGeoData)
  const payersSelectLists = useSelector(payersSelectors.getPayersSelectLists)

  const { t } = useTranslation(['countries', 'other'])

  const payersSelectedFields = useSelector(payersSelectors.getPayersSelectedFields)

  useEffect(() => {
    if (payersSelectLists) {
      if (!payersSelectedFields?.country || !payersSelectedFields?.country_physical) {
        const data = {
          country: payersSelectLists?.country[0]?.$key,
          profiletype: payersSelectLists?.profiletype[0]?.$key,
        }
        dispatch(payersOperations.getPayerModalInfo(data))
      }
    }
  }, [payersSelectLists])

  return payersSelectLists?.country?.length ? (
    <Select
      placeholder={t('Not chosen', { ns: 'other' })}
      label={`${t('The country', { ns: 'other' })}:`}
      value={selectValue}
      getElement={item => setSelectFieldValue('country', item)}
      isShadow
      className={selectClassName}
      itemsList={payersSelectLists?.country?.map(({ $key, $, $image }) => {
        return {
          label: (
            <div className={countrySelectClassName}>
              <img src={`${BASE_URL}${$image}`} alt="flag" />
              {t(`${$.trim()}`)}
            </div>
          ),
          value: $key,
        }
      })}
      isRequired
      disabled
      withoutArrow={true}
    />
  ) : (
    <Select
      placeholder={t('Not chosen', { ns: 'other' })}
      label={`${t('The country', { ns: 'other' })}:`}
      value={geoData?.clients_country_id}
      setFieldValue={geoData?.clients_country_id}
      setElement={() => {
        return setSelectFieldValue('country', geoData?.clients_country_id)
      }}
      isShadow
      className={selectClassName}
      itemsList={payersSelectLists?.country?.map(() => ({
        label: (
          <div className={countrySelectClassName}>
            <img src={`${geoImgURL}${geoData?.clients_country_code}.png`} alt="flag" />
            {t(`${geoData?.clients_country_name.trim()}`)}
          </div>
        ),
        value: geoData?.clients_country_id,
      }))}
      isRequired
      disabled
      withoutArrow={true}
    />
  )
}

SelectGeo.propTypes = {
  setSelectFieldValue: PropTypes.func,
  selectValue: PropTypes.string,
  selectClassName: PropTypes.string,
  countrySelectClassName: PropTypes.string,
}
