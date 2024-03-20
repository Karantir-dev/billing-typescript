import { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { Icon } from '@components'
import { useOutsideAlerter } from '@utils'
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
    hasNotSelectedOption,
    saleIcon,
    withoutArrow,
    itemIcon,
    disableClickActive = true
  } = props
  const { t } = useTranslation('other')

  const [isOpened, setIsOpened] = useState(false)
  const [selectedItem, setSelectedItem] = useState()

  const dropdown = useRef(null)

  if (hasNotSelectedOption && Array.isArray(itemsList)) {
    if (!itemsList?.some(item => item.label === t('Not selected')))
      itemsList.unshift({ label: t('Not selected'), value: '' })
  }

  if (!placeholder) {
    placeholder = t('select_placeholder')
  }

  const clickOutside = () => {
    setIsOpened(false)
  }

  useOutsideAlerter(dropdown, isOpened, clickOutside)

  useEffect(() => {
    if (itemsList && value !== undefined) {
      itemsList?.forEach(el => {
        if (el?.value === value) {
          setSelectedItem(el)
        }
      })
    }
  }, [value, itemsList])

  useEffect(() => {
    if (dropdown.current?.scrollHeight === 260) {
      dropdown.current.classList.add(s.scrollable)
    }
  }, [isOpened])

  const itemSelectHandler = item => {
    if (value === item.value && disableClickActive) {
      setIsOpened(false)
      return
    }

    setSelectedItem(item)
    getElement(item?.value)
    setIsOpened(false)
  }

  const openHandler = () => {
    setIsOpened(true)
  }

  const isDisabled = disabled || itemsList?.length < 2
  const hasNoArrow = withoutArrow || itemsList?.length < 2

  return (
    <div className={cn({ [s.field_wrapper]: true, [className]: className })}>
      {label && (
        <label className={s.label}>
          {' '}
          {isRequired ? requiredLabel(label) : label} {saleIcon}
        </label>
      )}
      <button
        type="button"
        style={{ height }}
        className={s.input_wrapper}
        onClick={openHandler}
        data-testid="period_select"
        disabled={isDisabled}
      >
        <div
          className={cn(
            {
              [s.input]: true,
              [s.shadow]: isShadow,
              [s.field_bgc]: background,
              [s.disabled]: isDisabled,
            },
            inputClassName,
          )}
        >
          <span
            className={cn({
              [s.placeholder]: !selectedItem?.label,
              [s.additionalField]: additionalPlaceHolder,
              [s.selected_with_icon]: selectedItem?.icon,
            })}
          >
            {selectedItem?.label || placeholder}
            {itemIcon && (
              <Icon name={itemsList.find(el => el.value === selectedItem?.value)?.icon} />
            )}
          </span>
          {additionalPlaceHolder && (
            <div className={s.additionalPlaceHolder}>{additionalPlaceHolder}</div>
          )}
          {!hasNoArrow && (
            <Icon
              name="Shevron"
              className={cn({
                [s.right_icon]: true,
                [s.opened]: isOpened,
                [s.disabled]: isDisabled,
              })}
            />
          )}
        </div>
      </button>

      {itemsList?.length !== 0 && (
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
                  className={cn(s.list_item, {
                    [s.list_item_active]: selectedItem?.value === el.value,
                  })}
                  data-testid={`qwe${index}`}
                >
                  <span className={s.name}>
                    {el.label} {itemIcon && <Icon name={el.icon} />}
                  </span>
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
  withoutArrow: PropTypes.bool,
}

Select.defaultProps = {
  isShadow: false,
  getElement: () => null,
  placeholder: '',
  isRequired: false,
  error: '',
}
