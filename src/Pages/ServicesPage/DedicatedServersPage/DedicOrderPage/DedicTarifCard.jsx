import s from './DedicOrderPage.module.scss'

import classNames from 'classnames'
import { dedicOperations } from '@redux'
import { useDispatch } from 'react-redux'

export default function DedicTarifCard({
  parsePrice,
  item,
  values,
  setParameters,
  setFieldValue,
  setPrice,
  setTarifChosen,
  periodName,
  signal,
  setIsLoading
}) {
  const dispatch = useDispatch()
  const descriptionBlocks = item?.desc?.$.split('/')
  const cardTitle = descriptionBlocks[0]

  const parsedPrice = parsePrice(item?.price?.$)

  const priceAmount = parsedPrice.amoumt
  const pricePercent = parsedPrice.percent
  const priceSale = parsedPrice.sale
  const hasSale = parsedPrice.length

  return (
    <div
      className={classNames(s.tarif_card, {
        [s.selected]: item?.pricelist?.$ === values.tarif,
      })}
      key={item?.desc?.$}
    >
      <button
        onClick={() => {
          setParameters(null)
          setFieldValue('tarif', item?.pricelist?.$)
          setPrice(priceAmount)
          setTarifChosen()

          dispatch(
            dedicOperations.getParameters(
              values.period,
              values.datacenter,
              item?.pricelist?.$,
              setParameters,
              setFieldValue,
              signal,
              setIsLoading
            ),
          )
        }}
        type="button"
        className={s.tarif_card_btn}
      >
        {hasSale === 3 && (
          <span
            className={classNames({
              [s.sale_percent]: hasSale === 3,
            })}
          >
            {pricePercent}
          </span>
        )}

        <span
          className={classNames({
            [s.card_title]: true,
            [s.selected]: item?.pricelist?.$ === values.tarif,
          })}
        >
          {cardTitle}
        </span>
        <div className={s.price_wrapper}>
          <span
            className={classNames({
              [s.price]: true,
              [s.selected]: item?.pricelist?.$ === values.tarif,
            })}
          >
            {priceAmount + ' €' + '/' + periodName}
          </span>
          {hasSale === 3 && <span className={s.sale_price}>{`${priceSale}`}</span>}
        </div>

        {descriptionBlocks.slice(1).map((el, i) => (
          <span key={i} className={s.card_subtitles}>
            {el}
          </span>
        ))}
      </button>
    </div>
  )
}
