import cn from 'classnames'
import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Shevron } from '../../../../images'
import { selectors } from '../../../../Redux'
import { useOutsideAlerter } from '../../../../utils'

import s from './SoftwareOSSelect.module.scss'
import ss from '../../../ui/Select/Select.module.scss'

export default function SoftwareOSSelect({ iconName, itemsList, state, getElement }) {
  const dropdown = useRef(null)
  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  const [isOpened, setIsOpened] = useState(false)
  const [selectedItem, setSelectedItem] = useState(itemsList[0])

  useOutsideAlerter(dropdown, isOpened, () => setIsOpened(false))

  const itemSelectHandler = item => {
    setSelectedItem(item)
    getElement(item?.value)
    setIsOpened(false)
  }

  return (
    <div className={cn(s.bg, { [s.selected]: selectedItem.value === state })}>
      <button className={s.btn} type="button" onClick={() => setIsOpened(true)}>
        <img
          className={s.img}
          src={require(`../../../../images/soft_os/${
            darkTheme ? iconName + '_dt' : iconName
          }.png`)}
          alt="icon"
        />
        {selectedItem?.label}

        <Shevron className={cn(ss.right_icon, { [ss.opened]: isOpened })} />
      </button>

      {itemsList.length !== 0 && (
        <div ref={dropdown} className={cn(ss.dropdown, { [ss.opened]: isOpened })}>
          <div className={s.list}>
            {itemsList?.map((el, index) => {
              return (
                <div
                  className={s.list_item}
                  onClick={() => itemSelectHandler(el)}
                  key={index}
                  tabIndex={0}
                  onKeyDown={null}
                  role="button"
                >
                  <img
                    className={cn(s.img, s.left, s.grey)}
                    src={require(`../../../../images/soft_os/${
                      darkTheme ? iconName + '_dt' : iconName
                    }.png`)}
                    alt="icon"
                  />
                  {el.label}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}