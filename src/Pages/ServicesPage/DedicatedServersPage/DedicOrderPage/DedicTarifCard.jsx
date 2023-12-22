import s from './DedicOrderPage.module.scss'

import classNames from 'classnames'
import { dedicOperations, vdsOperations } from '@redux'
import { useDispatch } from 'react-redux'
import { HintWrapper, Icon } from '@src/Components'
import { useTranslation } from 'react-i18next'
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
  dedicInfoList,
}) {
  const { t } = useTranslation(['dedicated_servers'])
  const dispatch = useDispatch()
  const descriptionBlocks = item?.desc?.$.split('/')
  const cardTitle = descriptionBlocks[0]
  const cardParameters = descriptionBlocks.slice(1)
  const parsedPrice = parsePrice(item?.price?.$)

  const priceAmount = parsedPrice.amount
  const pricePercent = parsedPrice.percent
  const priceSale = parsedPrice.sale
  const hasSale = parsedPrice.length

  const itemInfo = dedicInfoList.find(el => el.service_id === +item.pricelist.$)

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
        <div className={s.card_header}>
          <span
            className={classNames({
              [s.card_title]: true,
              [s.selected]: item?.pricelist?.$ === values.tarif,
              [s.vds]: item.isVds,
            })}
          >
            {cardTitle}
          </span>
          {!item.isVds && (
            <div className={s.activation_info}>
              <span>
                {t('dedic_available_count', { count: itemInfo?.specs.count_exists || 0 })}
              </span>
              <span>
                {itemInfo?.specs.count_exists
                  ? t('dedic_activation_time')
                  : t('dedic_ready_time')}
                {!itemInfo?.specs.count_exists && (
                  <HintWrapper
                    popupClassName={s.activation_info_hint}
                    label={t('dedic_activation_info')}
                    wrapperClassName={s.activation_info_hint_wrapper}
                  >
                    <Icon name="Info" />
                  </HintWrapper>
                )}
              </span>
            </div>
          )}
        </div>
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
