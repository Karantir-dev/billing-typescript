import React, { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { Shevron } from '../../../images'
import { useOutsideAlerter } from '../../../utils'
import s from './Select.module.scss'

export default function Component(props) {
  const {
    label,
    isShadow, // shadow or border
    className,
    inputClassName,
    itemsList,
    getElement,
    value,
  } = props

  const [isOpened, setIsOpened] = useState(false)
  const [selectedItem, setSelectedItem] = useState()

  const dropdown = useRef(null)

  const clickOutside = () => {
    console.log('outside click')
    setIsOpened(false)
  }

  useOutsideAlerter(dropdown, isOpened, clickOutside)

  useEffect(() => {
    if (itemsList && value) {
      itemsList?.forEach(el => {
        if (el?.value === value) {
          setSelectedItem(el)
        }
      })
    }
  }, [value, itemsList])

  const itemSelectHandler = item => {
    setSelectedItem(item)
    getElement(item?.value)
    setIsOpened(false)
  }

  const openHandler = () => {
    console.log('icon click')
    setIsOpened(true)
  }

  return (
    <div className={cn({ [s.field_wrapper]: true, [className]: className })}>
      {label && <label className={s.label}>{label}</label>}
      <button type="button" className={s.input_wrapper} onClick={openHandler}>
        <div
          className={cn(
            {
              [s.input]: true,
              [s.shadow]: isShadow,
            },
            inputClassName,
          )}
        >
          {selectedItem?.label}
          <Shevron className={cn({ [s.right_icon]: true, [s.opened]: isOpened })} />
        </div>
      </button>

      {itemsList.length !== 0 && (
        <div ref={dropdown} className={cn(s.dropdown, { [s.opened]: isOpened })}>
          <div className={s.list}>
            {itemsList?.map((el, index) => {
              return (
                <button
                  onClick={() => itemSelectHandler(el)}
                  type="button"
                  key={index}
                  className={s.list_item}
                >
                  <span className={s.name}>{el.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

Component.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  isShadow: PropTypes.bool.isRequired,
  value: PropTypes.string,
  itemsList: PropTypes.oneOfType([
    PropTypes.arrayOf({ label: PropTypes.string, value: PropTypes.string }),
    PropTypes.array,
  ]),
  getElement: PropTypes.func,
}
Component.defaultProps = {
  isShadow: false,
  getElement: () => null,
  itemsList: [],
}
