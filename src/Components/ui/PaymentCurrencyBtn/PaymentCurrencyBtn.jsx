import React from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { Shevron } from '../../../images/'
import s from './PaymentCurrencyBtn.module.scss'

export default function PaymentCurrencyBtn({ list, currentValue, setValue }) {
  return (
    <div
      className={cn({
        [s.select_wrapper]: true,
      })}
    >
      <div className={cn(s.current_lang, { [s.pointer]: list?.length > 1 })}>
        {currentValue} {list?.length > 1 && <Shevron className={s.icon} />}
      </div>

      {list?.length > 1 && (
        <div className={s.lang_dropdown}>
          <ul className={s.dropdown_list}>
            <li className={s.shevron_wrapper}>
              <div className={s.dropdown_shevron}></div>
            </li>
            {list.map(({ $key, $ }) => {
              if (currentValue === $) {
                return
              }
              return (
                <li key={$key} className={s.lang_item}>
                  <button
                    className={s.lang_btn}
                    type="button"
                    onClick={() => setValue && setValue({ title: $, value: $key })}
                  >
                    {$}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

PaymentCurrencyBtn.propTypes = {
  currentValue: PropTypes.string,
  list: PropTypes.array,
  setValue: PropTypes.func,
}
