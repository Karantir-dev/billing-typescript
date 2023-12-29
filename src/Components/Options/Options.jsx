import { useRef, useState } from 'react'
import { Icon } from '..'
import s from './Options.module.scss'
import cn from 'classnames'
import { useOutsideAlerter } from '@utils'

export default function Options({ options }) {
  const dropdownEl = useRef()
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)

  useOutsideAlerter(dropdownEl, isOptionsOpen, () => setIsOptionsOpen(false))

  return (
    <div className={s.wrapper}>
      <button className={s.btn} type="button" onClick={() => setIsOptionsOpen(true)}>
        <Icon name="Settings" />
      </button>

      {isOptionsOpen && (
        <div className={s.dropdown} ref={dropdownEl}>
          <div className={s.pointer_wrapper}>
            <div className={s.pointer}></div>
          </div>
          <ul>
            {options.map(option => (
              <li
                key={option.label}
                className={cn(s.tool_item, { [s.tool_item_delete]: option.isDelete })}
              >
                <button
                  className={s.tool_btn}
                  type="button"
                  onClick={() => {
                    option.onClick()
                    setIsOptionsOpen(false)
                  }}
                  disabled={option.disabled}
                >
                  <Icon
                    name={option.icon}
                    className={cn(s.tool_icon, { [s.tool_icon_delete]: option.isDelete })}
                  />
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}