import { useEffect, useState } from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import s from './VpnTarifCard.module.scss'
export default function Component(props) {
  const { t } = useTranslation(['virtual_hosting', 'other'])

  const [data, setData] = useState(null)

  const { tariff, selected, setPriceHandler, period } = props

  useEffect(() => {
    const data = {}

    const newArr = tariff?.desc?.$?.split(' |')?.map(el => {
      el = el?.replace('<p>', '')
      el = el?.replace('</p>', '')
      el = el?.replace('\n', '')

      return el
    })

    newArr?.forEach((el, index) => {
      if (index === 0) {
        return (data.name = el)
      }
    })

    setData(data)
  }, [tariff])

  const parsePrice = price => {
    const words = price?.match(/[\d|.|\\+]+/g)
    const amounts = []

    if (words && words.length > 0) {
      words.forEach(w => {
        if (!isNaN(w)) {
          amounts.push(w)
        }
      })
    } else {
      return
    }

    if (amounts?.length === 1) {
      return {
        amount: amounts[0],
      }
    }

    return {
      percent: amounts[0],
      old_amount: amounts[1],
      amount: amounts[2],
    }
  }

  return (
    <div
      tabIndex={0}
      onKeyDown={null}
      role="button"
      onClick={setPriceHandler}
      className={cn(s.cardBg, { [s.selected]: selected })}
    >
      <div className={s.cardBlock}>
        <div className={s.tariffName}>{data?.name}</div>

        <img src={require('@images/services/vpn.png')} alt={'vpn'} />
        <div className={s.charBlock}>
          <div className={s.tariffPrice}>
            {parsePrice(tariff?.price?.$)?.amount} EUR/{t(period, { ns: 'other' })}
          </div>
        </div>
      </div>
    </div>
  )
}
