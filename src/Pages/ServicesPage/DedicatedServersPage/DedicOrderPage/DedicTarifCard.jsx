import s from './DedicOrderPage.module.scss'

import classNames from 'classnames'
import { cartOperations } from '@redux'
import { useDispatch } from 'react-redux'
import { TooltipWrapper, Icon } from '@src/Components'
import { useTranslation } from 'react-i18next'
export default function DedicTarifCard({
  parsePrice,
  item,
  values,
  setParameters,
  setFieldValue,
  setTarifChosen,
  setSelectedTariffId,
  signal,
  setIsLoading,
  dedicInfoList,
  setPeriodName,
}) {
  const { t } = useTranslation(['dedicated_servers'])
  const dispatch = useDispatch()
  const descriptionBlocks = item?.desc?.$.split('/')
  const cardTitle = descriptionBlocks[0]
  const cardParameters = descriptionBlocks.slice(1)
  const parsedPrice = parsePrice(item?.price?.$)

  const priceAmount = parsedPrice.amount
  const priceSale = parsedPrice.sale
  const hasSale = parsedPrice.length
  const periodName = parsedPrice.periodName

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
          if (item?.pricelist?.$ === values.tarif) return
          setFieldValue('tarif', item?.pricelist?.$)
          setTarifChosen(item.isVds ? 'vds' : 'dedic')
          setPeriodName(periodName)
          setSelectedTariffId(item?.pricelist?.$)

          dispatch(
            cartOperations.getTariffParameters(
              {
                service: item.isVds ? 'vds' : 'dedic',
                id: item?.pricelist?.$,
                period: values.period,
              },
              setParameters,
              undefined,
              signal,
              setIsLoading,
            ),
          )
        }}
        type="button"
        className={classNames(s.tarif_card_btn, { [s.new]: item.isNew })}
      >
        {item.isNew && <span className={s.new_tariff}>NEW</span>}
        <div className={s.card_header}>
          <span
            className={classNames({
              [s.card_title]: true,
              [s.selected]: item?.pricelist?.$ === values.tarif,
              [s.new]: item.isNew,
            })}
          >
            {cardTitle}
          </span>
          {!item.isVds && (
            <div className={s.activation_info}>
              <span>
                {t('dedic_available_count', {
                  count: itemInfo?.specs?.count_exists || 0,
                })}
              </span>
              <span>
                {itemInfo?.specs?.count_exists
                  ? t('dedic_activation_time')
                  : t('dedic_ready_time')}
                {!itemInfo?.specs?.count_exists && (
                  <TooltipWrapper
                    className={s.activation_info_hint}
                    content={t('dedic_activation_info')}
                    id={`tariff_${itemInfo?.service_id}`}
                  >
                    <Icon name="Info" id={`tariff_${itemInfo?.service_id}`} />
                  </TooltipWrapper>
                )}
              </span>
            </div>
          )}
        </div>
        <div className={classNames(s.price_wrapper, { [s.new]: item.isNew })}>
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
                {' ' + t(el.trim())}
              </li>
            ))}
          </ul>
        )}
      </button>
    </div>
  )
}
