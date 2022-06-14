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

  const [dropOpened, setDropOpened] = useState(false)

  const tariffName = el?.desc?.$.match(/(?<=<b>)(.+?)(?= \(base price\))/g)

  // const renderDesc = () => {}
  const onShevronClick = () => {
    if (!dropOpened) {
      dropdownEl.current.style.height = dropdownEl.current.scrollHeight + 'px'
      priceEl.current.style.marginBottom = '15px'
    } else {
      priceEl.current.style.marginBottom = '0'
      dropdownEl.current.style.height = 0
    }
    setDropOpened(!dropOpened)
  }
  return (
    <>
      <div className={s.server_item}>
        <button className={s.shevron_btn} type="button" onClick={onShevronClick}>
          <Shevron className={cn({ [s.shevron]: true, [s.opened]: dropOpened })} />
        </button>

        {tabletOrHigher && (
          <img src={require('./../../../images/cart/vds.png')} alt="vds" />
        )}
        <p className={s.tariff_name}>{tariffName}</p>
        <div className={s.price_wrapper}>
          {el?.discount_percent?.$ && (
            <p className={s.discount_wrapper}>
              <span className={s.percent}>-{el?.discount_percent?.$}</span>
              {'  '}
              <span className={s.old_price}>{el?.fullcost?.$} EUR</span>
            </p>
          )}

          <p className={s.price} ref={priceEl}>
            {el?.cost?.$} EUR
          </p>
        </div>

        {typeof deleteItemHandler === 'function' && (
          <button className={s.btn_delete} type="button" onClick={deleteItemHandler}>
            <Delete />
          </button>
        )}

        <div className={s.dropdown} ref={dropdownEl}>
          <p>
            {t('processors')}:
            <span className={s.value}>
              {el?.desc?.$.match(/(?<=CPU count)(.+?)(?=<br\/>)/g)}
            </span>
          </p>
          <p>
            {t('memory')}:
            <span className={s.value}>
              {el?.desc?.$.match(/(?<=Memory)(.+?)(?=<br\/>)/g)}
            </span>
          </p>
          <p>
            {t('disk_space')}:
            <span className={s.value}>
              {el?.desc?.$.match(/(?<=Disk space)(.+?)(?=<br\/>)/g)}
            </span>
          </p>
          <p>
            {t('IPcount')}:
            <span className={s.value}>
              {el?.desc?.$.match(/(?<=IP-addresses count)(.+?)(?=<br\/>)/g)[0].replace(
                'Unit',
                t('Unit'),
              )}
            </span>
          </p>
          <p>
            {t('port_speed')}:
            <span className={s.value}>
              {el?.desc?.$.match(/(?<=Port speed)(.+?)(?=<br\/>)/g)}
            </span>
          </p>
          <p>
            {t('license_to_panel')}:
            <span className={s.value}>
              {' '}
              {t(el?.desc?.$.match(/(?<=Control panel )(.+?)(?=$)/g)[0])}
            </span>
          </p>
        </div>
      </div>
    </>
  )
}
