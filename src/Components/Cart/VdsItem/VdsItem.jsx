import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Shevron, Delete } from '../../../images'
import cn from 'classnames'
import { useMediaQuery } from 'react-responsive'

import s from './VdsItem.module.scss'

export default function VdsItem({ el, deleteItemHandler }) {
  const { t } = useTranslation(['vds'])
  const tabletOrHigher = useMediaQuery({ query: '(min-width: 768px)' })
  const dropdownEl = useRef()
  const priceEl = useRef()
  const infoEl = useRef()

  const [dropOpened, setDropOpened] = useState(false)
  const controlPanel = el?.desc?.$?.includes('Control panel')
  const IPaddresses = el?.desc?.$?.includes('IP-addresses')
  const hasBasePrice = el?.desc?.$?.includes('base price')

  const tariffName = hasBasePrice
    ? el?.desc?.$.match(/<b>(.+?)(?= \(base price\))/)[1]
    : el?.pricelist_name?.$

  const onShevronClick = () => {
    if (!dropOpened) {
      dropdownEl.current.style.height = dropdownEl.current.scrollHeight + 'px'
      if (!tabletOrHigher) {
        priceEl.current.style.marginBottom = '15px'
      } else {
        infoEl.current.style.marginBottom = '15px'
      }
    } else {
      dropdownEl.current.style.height = '0'
      priceEl.current.style.marginBottom = '0'
      infoEl.current.style.marginBottom = '0'
    }
    setDropOpened(!dropOpened)
  }

  const getTranslatedText = regex => {
    let text = el?.desc?.$?.match(regex)?.[1]
    if (text?.includes('EUR')) {
      text = text.replace(text.split('EUR ')[1], t(text.split('EUR ')[1].trim()))
    } else {
      text = t(text)
    }

    return text
  }

  const getTranslatedCP = string => {
    const partText = string?.match(/^(.+?)(?= - \d+?\.)/g)?.[0]

    return partText ? string.replace(partText, t(partText)) : string
  }

  return (
    <>
      <div className={s.server_item}>
        <button className={s.shevron_btn} type="button" onClick={onShevronClick}>
          <Shevron
            width={11}
            className={cn({ [s.shevron]: true, [s.opened]: dropOpened })}
          />
        </button>

        <div className={s.main_info_wrapper} ref={infoEl}>
          {tabletOrHigher && (
            <img
              width={27}
              height={33}
              src={require('./../../../images/cart/vds.png')}
              alt="vds"
            />
          )}
          <p className={s.tariff_name}>{tariffName}</p>
          <div className={s.price_wrapper}>
            {el?.discount_percent?.$ && (
              <p className={s.discount_wrapper}>
                <span className={s.percent}>-{el?.discount_percent?.$}</span>
                <span className={s.old_price}>{el?.fullcost?.$} EUR</span>
              </p>
            )}

            <p className={s.price} ref={priceEl}>
              {el?.cost?.$} EUR{' '}
              {tabletOrHigher && (
                <span className={s.period}>
                  {t(el?.desc?.$.match(/EUR (.+?)(?= <br\/>)/))}
                </span>
              )}
            </p>
          </div>

          {typeof deleteItemHandler === 'function' && (
            <button className={s.btn_delete} type="button" onClick={deleteItemHandler}>
              <Delete />
            </button>
          )}
        </div>

        <div className={s.dropdown} ref={dropdownEl}>
          {hasBasePrice && (
            <p className={s.value_item}>
              {t('processors')}:
              <span className={s.value}>
                {getTranslatedText(/CPU count(.+?)(?=<br\/>)/)}
              </span>
            </p>
          )}

          {hasBasePrice && (
            <p className={s.value_item}>
              {t('memory')}:
              <span className={s.value}>
                {getTranslatedText(/Memory(.+?)(?=<br\/>)/)}
              </span>
            </p>
          )}

          {hasBasePrice && (
            <p className={s.value_item}>
              {t('disk_space')}:
              <span className={s.value}>
                {getTranslatedText(/Disk space(.+?)(?=<br\/>)/)}
              </span>
            </p>
          )}

          {IPaddresses && (
            <p className={s.value_item}>
              {t('IPcount')}:
              <span className={s.value}>
                {el?.desc?.$.match(/IP-addresses count(.+?)(?=<br\/>)/)[1].replace(
                  'Unit',
                  t('Unit'),
                )}
              </span>
            </p>
          )}

          {hasBasePrice && (
            <p className={s.value_item}>
              {t('port_speed')}:
              <span className={s.value}>
                {el?.desc?.$.match(/(Port speed|Outgoing traffic)(.+?)(?=<br\/>|$)/)}
              </span>
            </p>
          )}

          {controlPanel && (
            <p className={s.value_item}>
              {t('license_to_panel')}:{' '}
              <span className={s.value}>
                {getTranslatedCP(getTranslatedText(/Control panel (.+?)(?=$|<br\/>)/))}
              </span>
            </p>
          )}

          {el?.desc?.$.includes('Service limits') && (
            <p className={s.value_item}>
              {t('Service limits')}:{' '}
              <span className={s.value}>{t('port_speed_limits')}</span>
            </p>
          )}
        </div>
      </div>
    </>
  )
}
