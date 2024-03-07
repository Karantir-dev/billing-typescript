import RangeSlider from 'react-range-slider-input'
import 'react-range-slider-input/dist/style.css'
import './InputRange.scss'
import cn from 'classnames'

const InputRange = ({ className, ...props }) => {
  return (
    <RangeSlider {...props} className={cn('input_range', { [className]: className })} />
  )
}

export default InputRange
