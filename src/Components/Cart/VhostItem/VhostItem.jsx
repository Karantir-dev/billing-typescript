import React from 'react'
// import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { Delete } from '../../../images'
import s from './VhostItem.module.scss'

export default function Component(props) {
  const {
    cost,
    discount_percent,
    fullcost,
    pricelist_name,
    itemId,
    // count,
    deleteItemHandler,
  } = props
  const tabletOrHigher = useMediaQuery({ query: '(min-width: 768px)' })
  // const { t } = useTranslation(['cart', 'dedicated_servers', 'other', 'vds'])

  return (
    <div className={s.domainItem}>
      {/* {tabletOrHigher && (
        <img src={require('./../../../images/cart/vhost.png')} alt="vhost" />
      )} */}
      <div className={s.priceList}>
        {!tabletOrHigher && (
          <div className={s.control_bts_wrapper}>
            {typeof deleteItemHandler === 'function' && (
              <button className={s.btn_delete} type="button" onClick={deleteItemHandler}>
                <Delete />
              </button>
            )}
          </div>
        )}

        {/* {tabletOrHigher && (
          <p className={s.countItem}>
            {count} {t('pcs.', { ns: 'vds' })}
          </p>
        )} */}

        <div className={s.domainInfo}>
          <span className={s.domainName}>
            {pricelist_name} #{itemId}
          </span>
        </div>
        <div className={s.costBlock}>
          <div className={s.cost}>{cost} EUR</div>
          {discount_percent && (
            <div className={s.discountBlock}>
              <span className={s.discountPerCent}>-{discount_percent}</span>
              <span className={s.fullcost}>{fullcost} EUR</span>
            </div>
          )}
        </div>
        {typeof deleteItemHandler === 'function' && tabletOrHigher && (
          <button className={s.btn_delete} type="button" onClick={deleteItemHandler}>
            <Delete />
          </button>
        )}
      </div>
    </div>
  )
}
