import { TARIFFS_PRICES } from '../constants'

export default function rewriteCloudsPrices(payload) {
  if (payload) {
    try {
      const key = Object.keys(payload)[0]

      payload[key] = payload[key]?.map(el => {
        const cutedName = el.title.main.$.split('|')[0].trim()

        const newDayPrice = TARIFFS_PRICES[cutedName]?.day
        const newMonthPrice = TARIFFS_PRICES[cutedName]?.month
        el.title.main.$ = cutedName
        el.prices.price.cost.$ = String(newDayPrice)
        el.prices.price.cost.month = String(newMonthPrice)

        return el
      })

      return payload
    } catch (err) {
      console.error(err.message)
    }
  } else {
    return {}
  }
}
