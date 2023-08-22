import { axiosInstance } from '@config/axiosInstance'
import { userSelectors } from '@src/Redux'
import qs from 'qs'
import { useSelector } from 'react-redux'

export default function fraudCheckSender(sessionId) {
  const userInfo = useSelector(userSelectors.getUserInfo)

  axiosInstance.post(
    '/',
    qs.stringify({
      func: 'zomrofrautcheck',
      auth: sessionId,
      sessid: sessionId,
      out: 'json',
      sok: 'ok',
      data: JSON.dump({
        device: {
          ip_address: '152.216.7.110',
          accept_language: 'en-US,en;q=0.8',
          user_agent:
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.89 Safari/537.36',
        },
        billing: {
          first_name: userInfo?.$realname,
          address: '101 Address Rd.',
          country: 'US',
          phone_country_code: '1',
          phone_number: '123-456-7890',
        },
        shopping_cart: [
          {
            category: 'pets',
            quantity: 2,
            price: 20.43,
            item_id: 'lsh12',
          },
          { category: 'beauty', quantity: 1, price: 100.0, item_id: 'ms12' },
        ],
      }),
    }),
  )
}

// tocken = 'f88274ab3fa4695258c798ff'
// data = {
//   func: 'zomrofrautcheck',
//   auth: tocken,
//   sessid: tocken,
//   out: 'json',
//   sok: 'ok',
//   data: JSON.dumps({
//     device: {
//       ip_address: '152.216.7.110',
//       accept_language: 'en-US,en;q=0.8',
//       user_agent:
//         'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.89 Safari/537.36',
//     },
//     billing: {
//       first_name: 'Jane',
//       address: '101 Address Rd.',
//       country: 'US',
//       phone_country_code: '1',
//       phone_number: '123-456-7890',
//     },
//     shopping_cart: [
//       {
//         category: 'pets',
//         quantity: 2,
//         price: 20.43,
//         item_id: 'lsh12',
//       },
//       { category: 'beauty', quantity: 1, price: 100.0, item_id: 'ms12' },
//     ],
//   }),
// }
