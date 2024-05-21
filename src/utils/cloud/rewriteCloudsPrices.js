import { TARIFFS_PRICES } from '../constants'

export default function rewriteCloudsPrices(payload) {
  if (payload) {
    const key = Object.keys(payload)[0]

    payload[key] = payload[key]?.map(el => {
      const newDayPrice = TARIFFS_PRICES[el.title.main.$]?.day
      const newMonthPrice = TARIFFS_PRICES[el.title.main.$]?.month
      el.prices.price.cost.$ = String(newDayPrice)
      el.prices.price.cost.month = String(newMonthPrice)

      return el
    })

    return payload
  } else {
    return {}
  }
}
