import { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { Check, Cross, Shevron } from '../../../images'
import { useOutsideAlerter } from '../../../utils'
import s from './SelectMultiple.module.scss'

export default function Component(props) {
  const {
    label,
    isShadow, // shadow or border
    className,
    itemsList,
    getElement,
    value,
    height,
    placeholder,
    inputClassName,
  } = props

  const [isOpened, setIsOpened] = useState(false)
  const [selectedItem, setSelectedItem] = useState([])

  const dropdown = useRef(null)

  const clickOutside = () => {
    setIsOpened(false)
  }

  let isElementSelected = item => {
    let flag = 0
    for (let i = 0; i < selectedItem.length; i++) {
      if (item?.value === selectedItem[i]?.value) {
        flag = 1
      }
    }
    return flag
  }

  useOutsideAlerter(dropdown, isOpened, clickOutside)

  useEffect(() => {
    let valuesList = value?.split(',')
    if (itemsList && (value || valuesList)) {
      itemsList?.forEach(el => {
        valuesList?.forEach(e => {
          if (el?.value === e) {
            if (!isElementSelected(el)) {
              setSelectedItem(item => [...item, el])
            }
          }
        })
      })
    }
  }, [value, itemsList])

  const itemSelectHandler = item => {
    let listOfValues = []
    if (!isElementSelected(item)) {
      setSelectedItem(el => [...el, item])
      listOfValues = [...selectedItem, item]
    } else {
      setSelectedItem(selectedItem.filter(el => el.value !== item.value))
      listOfValues = selectedItem.filter(el => el.value !== item.value)
    }
    let valuesString = listOfValues?.map(el => `${el.value}`) || ''
    getElement(valuesString?.join(','))
  }

  const openHandler = () => {
    setIsOpened(!isOpened)
  }

  const deleteItem = (item, event) => {
    event.stopPropagation()
    let listOfValues = selectedItem.filter(el => el.value !== item.value)
    setSelectedItem(listOfValues)
    let valuesString = listOfValues?.map(el => `${el.value}`) || ''
    getElement(valuesString?.join(','))
  }

  // const calculateTop = () => {
  //   if (selectedItem?.length > 1) {
  //     return 65 + 28 * (selectedItem?.length - 1)
  //   }
  //   return 70
  // }

  return (
    <div
      // style={{ marginBottom: calculateTop() - 70 }}
      className={cn({ [s.field_wrapper]: true, [className]: className })}
    >
      {label && <label className={s.label}>{label}</label>}
      <button
        type="button"
        style={{ height }}
        className={s.input_wrapper}
        onClick={isOpened ? null : openHandler}
      >
        <div
          className={cn({
            [s.input]: true,
            [s.shadow]: isShadow,
            [inputClassName]: inputClassName,
          })}
        >
          {selectedItem.length > 0 ? (
            <>
              {selectedItem?.map(el => (
                <div className={s.selected_item} key={el.value}>
                  <span>{el.label}</span>
                  <Cross
                    className={s.cross}
                    width={12}
                    height={12}
                    onClick={e => deleteItem(el, e)}
                  />
                </div>
              ))}
            </>
          ) : (
            <span className={cn({ [s.placeholder]: !selectedItem?.label })}>
              {placeholder}
            </span>
          )}
        </div>
        <Shevron className={cn({ [s.right_icon]: true, [s.opened]: isOpened })} />
      </button>
      {itemsList.length !== 0 && (
        <div
          ref={dropdown}
          // style={{ top: calculateTop() }}
          className={cn(s.dropdown, { [s.opened]: isOpened })}
        >
          <div className={s.list}>
            {itemsList?.map((el, index) => {
              return (
                <button
                  onClick={() => itemSelectHandler(el)}
                  type="button"
                  key={index}
                  className={s.list_item}
                >
                  <div
                    className={cn(s.checkBox, {
                      [s.selected]: isElementSelected(el),
                    })}
                  >
                    {isElementSelected(el) ? (
                      <Check
                        onClick={e => {
                          e.stopPropagation()
                          itemSelectHandler(el)
                        }}
                        className={s.checkImg}
                      />
                    ) : null}
                  </div>
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
  height: PropTypes.number,
  placeholder: PropTypes.string,
}
Component.defaultProps = {
  isShadow: false,
  getElement: () => null,
  itemsList: [],
  placeholder: '',
}
