import { useSelector } from 'react-redux'
import { authSelectors, settingsSelectors, userSelectors } from '@src/Redux'

export default function useFormFraudCheckData() {
  const userInfo = useSelector(userSelectors.getUserInfo)
  const userPreferences = useSelector(settingsSelectors.getUserEdit)
  const userParams = useSelector(settingsSelectors.getUserParams)
  const geoData = useSelector(authSelectors.getGeoData)

  return {
    device: {
      user_agent: window.navigator.userAgent,
    },
    billing: {
      first_name: userInfo?.$realname,
      address: userParams?.addr,
      country: geoData?.clients_country_code,

      // next two params need to be changed
      phone_country_code: userPreferences?.phone_country,
      phone_number: userPreferences?.phone?.phone,
    },
  }
}
