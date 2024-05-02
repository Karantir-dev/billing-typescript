import RangeSlider from 'react-range-slider-input'
import 'react-range-slider-input/dist/style.css'
import './InputRange.scss'
import cn from 'classnames'
import { useEffect, useRef } from 'react'
import { DoubleInputField } from '@components'

const InputRange = ({
  className,
  wrapperClassName,
  labels,
  id,
  value,
  withLabel,
  withFields,
  ...props
}) => {
  const minThumb = useRef()
  const maxThumb = useRef()

  useEffect(() => {
    if (!labels) return
    minThumb.current = document.querySelector(`#${id} [data-lower]`)
    maxThumb.current = document.querySelector(`#${id} [data-upper]`)
  }, [])

  useEffect(() => {
    if (!labels) return
    const minValue = minThumb.current?.getAttribute('aria-valuenow')
    const maxValue = maxThumb.current?.getAttribute('aria-valuenow')

    minThumb.current?.setAttribute('aria-displayvalue', labels[minValue])
    maxThumb.current.setAttribute('aria-displayvalue', labels[maxValue])
  }, [value])

  return (
    <div className={wrapperClassName}>
      {withFields && (
        <div>
          <DoubleInputField
            type="number"
            isShadow
            valueLeft={value[0]?.toString()}
            valueRight={value[1]?.toString()}
            nameLeft={'price_min'}
            nameRight={'price_max'}
            className="input_range__entry_fields"
            inputWrapperClass="input_range__entry_fields_wrapper"
            onChangeLeft={e => {
              const targetValue = +e.target.value
              const newValue =
                !targetValue || targetValue < props.min ? props.min : targetValue

              props.onInput([newValue, value[1]])
            }}
            onChangeRight={e => {
              const targetValue = +e.target.value
              const newValue =
                !targetValue || targetValue > props.max ? props.max : +targetValue

              props.onInput([value[0], newValue])
            }}
            onBlurLeft={e => {
              const targetValue = +e.target.value
              const values =
                targetValue > value[1] ? [value[1], targetValue] : [targetValue, value[1]]

              props.onThumbDragEnd(values)
            }}
            onBlurRight={e => {
              const targetValue = +e.target.value

              const values =
                targetValue < value[0] ? [targetValue, value[0]] : [value[0], targetValue]

              props.onThumbDragEnd(values)
            }}
          />
        </div>
      )}
      <RangeSlider
        id={id}
        className={cn('input_range', {
          [className]: className,
          input_range_label: withLabel,
          custom_label_values: labels,
        })}
        value={value}
        {...props}
      />
    </div>
  )
}

export default InputRange
