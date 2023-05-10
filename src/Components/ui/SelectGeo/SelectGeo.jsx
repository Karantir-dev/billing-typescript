import React from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { BASE_URL } from '../../../config/config'
import { Select } from '../..'

const geoImgURL = `${BASE_URL}/manimg/common/flag/`

export default function SelectGeo(props) {
  let {
    setSelectFieldValue,
    selectValue,
    selectClassName,
    countrySelectClassName,
    geoData,
    payersSelectLists,
  } = props
  const { t } = useTranslation(['countries', 'other'])

  return payersSelectLists?.country?.[0] ? (
    <Select
      placeholder={t('Not chosen', { ns: 'other' })}
      label={`${t('The country', { ns: 'other' })}:`}
      value={selectValue}
      getElement={item => setSelectFieldValue('country', item)}
      isShadow
      className={selectClassName}
      itemsList={[
        {
          label: (
            <div className={countrySelectClassName}>
              <img src={`${BASE_URL}${payersSelectLists.country[0].$image}`} alt="flag" />
              {t(`${payersSelectLists.country[0].$.trim()}`)}
            </div>
          ),
          value: payersSelectLists.country[0].$key,
        },
      ]}
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
      itemsList={[
        {
          label: (
            <div className={countrySelectClassName}>
              <img src={`${geoImgURL}${geoData?.clients_country_code}.png`} alt="flag" />
              {t(`${geoData?.clients_country_name.trim()}`)}
            </div>
          ),
          value: geoData?.clients_country_id,
        },
      ]}
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
  geoData: PropTypes.object,
  payersSelectLists: PropTypes.object,
}