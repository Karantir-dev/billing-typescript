import { useRef, useState } from 'react'
import { Icon } from '..'
import s from './Options.module.scss'
import cn from 'classnames'
import { useOutsideAlerter } from '@utils'

export default function Options({
  options,
  columns = 1,
  buttonClassName,
  listItemClassName,
  renderButton,
  isTileLayout,
}) {
  const dropdownEl = useRef()
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)

  useOutsideAlerter(dropdownEl, isOptionsOpen, () => setIsOptionsOpen(false))

  return isTileLayout ? (
    <ul className={cn(s.tools__list, s.tile_wrapper)}>
      {options
        .filter(option => !option.hidden)
        .map(option => (
          <li
            key={option.label}
            className={cn(s.tool_item, {
              [s.tool_item_delete]: option.isDelete,
              [s.tile_item]: isTileLayout,
            })}
          >
            <button
              className={cn(s.tool_btn, {
                [s.tile_btn]: isTileLayout,
              })}
              type="button"
              onClick={() => {
                option.onClick()
                setIsOptionsOpen(false)
              }}
              disabled={option.disabled}
            >
              <Icon
                name={option.icon}
                className={cn(s.tool_icon, {
                  [s.tool_icon_delete]: option.isDelete,
                  [s.tile_icon]: isTileLayout,
                })}
              />
              {option.label}
            </button>
          </li>
        ))}
    </ul>
  ) : (
    <div className={s.wrapper}>
      <button
        className={cn(s.btn, [buttonClassName], { [s.opened]: isOptionsOpen })}
        type="button"
        onClick={() => setIsOptionsOpen(true)}
      >
        {renderButton?.() ?? <Icon name="Settings" />}

        {isOptionsOpen && (
          <div className={s.pointer_wrapper}>
            <div className={s.pointer}></div>
          </div>
        )}
      </button>

      {isOptionsOpen && (
        <div className={s.dropdown} ref={dropdownEl}>
          <ul
            className={cn(s.tools__list)}
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {options
              .filter(option => !option.hidden)
              .map(option => (
                <li
                  key={option.label}
                  className={cn(s.tool_item, [listItemClassName], {
                    [s.tool_item_delete]: option.isDelete,
                  })}
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
                      className={cn(s.tool_icon, {
                        [s.tool_icon_delete]: option.isDelete,
                      })}
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
