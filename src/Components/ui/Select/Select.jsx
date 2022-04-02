import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { Shevron } from '../../../images'
import s from './Select.module.scss'

export default function Component(props) {
  const {
    label,
    isShadow, // shadow or border
    className,
    itemsList,
    getElement,
    value,
  } = props

  const [isOpened, setIsOpened] = useState(false)
  const [selectedItem, setSelectedItem] = useState()

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

  return (
    <div className={cn({ [s.field_wrapper]: true, [className]: className })}>
      {label && <label className={s.label}>{label}</label>}
      <button
        type="button"
        className={s.input_wrapper}
        onClick={() => setIsOpened(!isOpened)}
      >
        <div
          className={cn({
            [s.input]: true,
            [s.shadow]: isShadow,
          })}
        >
          {selectedItem?.label}
          <Shevron className={cn({ [s.right_icon]: true, [s.opened]: isOpened })} />
        </div>
      </button>
      {isOpened && itemsList.length !== 0 && (
        <div className={s.dropdown}>
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
