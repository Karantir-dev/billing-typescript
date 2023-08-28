import { useSelector } from 'react-redux'
import {
  // /authSelectors,
  settingsSelectors,
  userSelectors,
} from '@src/Redux'
import { useEffect, useRef } from 'react'

export default function useFormFraudCheckData() {
  const isDataExist = useRef(false)

  const userInfo = useSelector(userSelectors.getUserInfo)
  const userPreferences = useSelector(settingsSelectors.getUserEdit)
  const userParams = useSelector(settingsSelectors.getUserParams)
  // const geoData = useSelector(authSelectors.getGeoData)
  console.log('isDataExist', isDataExist)
  useEffect(() => {
    setTimeout(() => {
      isDataExist.current = true
    }, 500)
  }, [])
  console.log('userInfo', userInfo)
  console.log('userPreferences', userPreferences)
  console.log('userParams', userParams)

  return {
    device: {
      user_agent: window.navigator.userAgent,
    },
    billing: {
      first_name: userInfo?.$realname,
      address: userParams?.addr,
      country: 'US',
      phone_country_code: userPreferences?.phone_country,
      phone_number: userPreferences?.phone?.phone,
    },
    shopping_cart: [
      {
        category: 'Balance top up',
        quantity: 2,
        price: 20.43,
        item_id: 'lsh12',
      },
    ],
  }
}
