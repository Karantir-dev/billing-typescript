import React, { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { Shevron } from '../../../images'
import { useOutsideAlerter } from '../../../utils'
import s from './Select.module.scss'
import { useTranslation } from 'react-i18next'

export default function Select(props) {
  let {
    label,
    isShadow, // shadow or border
    className,
    inputClassName,
    dropdownClass,
    itemsList,
    getElement,
    value,
    height,
    placeholder,
    additionalPlaceHolder,
    background,
    disabled,
    isRequired,
    error,
  } = props
  const { t } = useTranslation('other')

  const [isOpened, setIsOpened] = useState(false)
  const [selectedItem, setSelectedItem] = useState()

  const dropdown = useRef(null)

  const defaultItemsList = [
    { label: t('current year'), value: 'currentyear' },
    { label: t('current month'), value: 'currentmonth' },
    { label: t('current week'), value: 'currentweek' },
    { label: t('current day'), value: 'today' },
    { label: t('previous year'), value: 'lastyear' },
    { label: t('previous month'), value: 'lastmonth' },
    { label: t('previous week'), value: 'lastweek' },
    { label: t('previous day'), value: 'lastday' },
    { label: t('year'), value: 'year' },
    { label: t('half a year'), value: 'halfyear' },
    { label: t('quarter'), value: 'quarter' },
    { label: t('month'), value: 'month' },
    { label: t('week'), value: 'week' },
    { label: t('whole period'), value: 'nodate' },
    { label: t('any period'), value: 'other' },
  ]
  if (!itemsList) {
    itemsList = defaultItemsList
  }
  if (!placeholder) {
    placeholder = t('select_placeholder')
  }

  const clickOutside = () => {
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
    setIsOpened(true)
  }

  return (
    <div className={cn({ [s.field_wrapper]: true, [className]: className })}>
      {label && (
        <label className={s.label}> {isRequired ? requiredLabel(label) : label}</label>
      )}
      <button
        type="button"
        style={{ height }}
        className={s.input_wrapper}
        onClick={openHandler}
        data-testid="period_select"
        disabled={disabled}
      >
        <div
          className={cn(
            {
              [s.input]: true,
              [s.shadow]: isShadow,
              [s.field_bgc]: background,
              [s.disabled]: disabled,
            },
            inputClassName,
          )}
        >
          <span
            className={cn({
              [s.placeholder]: !selectedItem?.label,
              [s.additionalField]: additionalPlaceHolder,
            })}
          >
            {selectedItem?.label || placeholder}
          </span>
          {additionalPlaceHolder && (
            <div className={s.additionalPlaceHolder}>{additionalPlaceHolder}</div>
          )}
          <Shevron className={cn({ [s.right_icon]: true, [s.opened]: isOpened })} />
        </div>
      </button>

      {itemsList.length !== 0 && (
        <div
          ref={dropdown}
          className={cn(s.dropdown, {
            [s.opened]: isOpened,
            [dropdownClass]: dropdownClass,
          })}
          data-testid="wrapper"
        >
          <div className={s.list}>
            {itemsList?.map((el, index) => {
              return (
                <div
                  tabIndex={0}
                  onKeyDown={null}
                  onClick={() => itemSelectHandler(el)}
                  role="button"
                  key={index}
                  className={s.list_item}
                  data-testid={`qwe${index}`}
                >
                  <span className={s.name}>{el.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
      {error?.length > 0 && <span className={s.error_message}>{error}</span>}
    </div>
  )
}

function requiredLabel(labelName) {
  return (
    <>
      {labelName} {<span className={s.required_star}>*</span>}
    </>
  )
}

Select.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  dropdownClass: PropTypes.string,
  isShadow: PropTypes.bool.isRequired,
  value: PropTypes.string,
  itemsList: PropTypes.oneOfType([
    PropTypes.arrayOf({ label: PropTypes.string, value: PropTypes.string }),
    PropTypes.array,
  ]),
  getElement: PropTypes.func,
  height: PropTypes.number,
  placeholder: PropTypes.string,
  background: PropTypes.bool,
  inputClassName: PropTypes.string,
  disabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  error: PropTypes.string,
}

Select.defaultProps = {
  isShadow: false,
  getElement: () => null,
  placeholder: '',
  isRequired: false,
  error: '',
}
