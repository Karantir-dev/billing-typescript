import { useSelector } from 'react-redux'
import { authSelectors, settingsSelectors, userSelectors } from '@src/Redux'
import { useEffect, useState } from 'react'

export default function useFormFraudCheckData() {
  const userInfo = useSelector(userSelectors.getUserInfo)
  const userPreferences = useSelector(settingsSelectors.getUserEdit)
  const userParams = useSelector(settingsSelectors.getUserParams)
  const geoData = useSelector(authSelectors.getGeoData)

  const [phoneCountryCode, setPhoneCountryCode] = useState('')
  const [phoneNumber, setPhoneNumber] = useState(
    userPreferences?.phone?.phone?.replace('+', ''),
  )

  useEffect(() => {
    if (userPreferences?.phone_countries) {
      let phoneCode = userPreferences?.phone_countries?.find(
        el => el.$key === userPreferences?.phone_country,
      )?.$code
      phoneCode = phoneCode.replace('+', '')

      setPhoneCountryCode(phoneCode)

      userPreferences?.phone?.phone?.replace('+', '') === phoneCode
        ? setPhoneNumber('')
        : setPhoneNumber(userPreferences?.phone?.phone?.replace('+', ''))
    }
  }, [userPreferences])

  return {
    device: {
      user_agent: window.navigator.userAgent,
    },
    billing: {
      first_name: userInfo?.$realname,
      address: userParams?.addr,
      country: geoData?.clients_country_code,
      phone_country_code: phoneCountryCode,
      phone_number: phoneNumber,
    },
  }
}
