import React from 'react'
// import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { Delete } from '../../../images'
import s from './VhostItem.module.scss'

export default function Component(props) {
  const { pricelist_name, itemId, deleteItemHandler } = props
  const tabletOrHigher = useMediaQuery({ query: '(min-width: 768px)' })

  return (
    <div className={s.domainItem}>
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

        <div className={s.domainInfo}>
          <span className={s.domainName}>
            {pricelist_name} #{itemId}
          </span>
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
