import cn from 'classnames'
import s from './Incrementer.module.scss'

export default function Incrementer({ count, setCount }) {
  return (
    <div className={s.increment_wrapper}>
      <button
        className={cn(s.count_btn, s.decrement)}
        type="button"
        onClick={() => {
          setCount(+count - 1)
        }}
        disabled={+count <= 1}
      ></button>

      <div className={s.input_wrapper_border}>
        <div className={s.input_wrapper_bg}>
          <div className={s.input_wrapper}>
            <input
              className={cn(s.count_input, s.amount_digit)}
              value={count}
              onChange={event => {
                const value =
                  event.target.value.length > 1
                    ? event.target.value?.replace(/^0/, '')
                    : event.target.value

                setCount(+event.target.value > 35 ? 35 : value)
              }}
              onBlur={event => {
                if (event.target.value < 1) setCount(1)
              }}
              type="number"
              min={1}
              max={35}
            />
          </div>
        </div>
      </div>
      {/* <button
        className={cn(s.count_btn, s.increment)}
        type="button"
        onClick={() => {
          setCount(+count + 1)
          setFieldValue(
            'finalTotalPrice',
            roundToDecimal(+(values.totalPrice * (+count + 1))),
          )
        }}
        disabled={+count >= 35}
      ></button> */}
    </div>
  )
}
