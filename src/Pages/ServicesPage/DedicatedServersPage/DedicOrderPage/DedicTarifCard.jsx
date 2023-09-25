import s from './DedicOrderPage.module.scss'

import classNames from 'classnames'
import { dedicOperations, vdsOperations } from '@redux'
import { useDispatch } from 'react-redux'
import { Icon } from '@src/Components'
export default function DedicTarifCard({
  parsePrice,
  item,
  values,
  setParameters,
  setFieldValue,
  setPrice,
  setTarifChosen,
  periodName,
  setVdsParameters,
  setSelectedTariffId,
  signal,
  setIsLoading,
}) {
  const dispatch = useDispatch()
  const descriptionBlocks = item?.desc?.$.split('/')
  const cardTitle = descriptionBlocks[0]
  const cardParameters = descriptionBlocks.slice(1)
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
          setVdsParameters(null)
          setFieldValue('tarif', item?.pricelist?.$)
          setPrice(priceAmount)
          setTarifChosen(item.isVds ? 'vds' : 'dedic')
          setSelectedTariffId(item?.pricelist?.$)

          item.isVds
            ? dispatch(
                vdsOperations.getTariffParameters(
                  values.period,
                  item?.pricelist?.$,
                  setVdsParameters,
                  signal,
                  setIsLoading,
                ),
              )
            : dispatch(
                dedicOperations.getParameters(
                  values.period,
                  values.datacenter,
                  item?.pricelist?.$,
                  setParameters,
                  setFieldValue,
                  signal,
                  setIsLoading,
                ),
              )
        }}
        type="button"
        className={classNames(s.tarif_card_btn, { [s.vds]: item.isVds })}
      >
        {hasSale === 3 && (
          <span
            className={classNames({
              [s.sale_percent]: hasSale === 3,
            })}
          >
            -{pricePercent}
          </span>
        )}

        {item.isVds && <span className={s.new_tariff}>NEW</span>}

        <span
          className={classNames({
            [s.card_title]: true,
            [s.selected]: item?.pricelist?.$ === values.tarif,
            [s.vds]: item.isVds,
          })}
        >
          {cardTitle}
        </span>
        <div className={classNames(s.price_wrapper, { [s.vds]: item.isVds })}>
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

        {!!cardParameters.length && (
          <ul className={s.card_parameters}>
            {cardParameters.map((el, i) => (
              <li key={i} className={s.card_subtitles}>
                <Icon name="CheckFat" />
                {el}
              </li>
            ))}
          </ul>
        )}
      </button>
    </div>
  )
}
