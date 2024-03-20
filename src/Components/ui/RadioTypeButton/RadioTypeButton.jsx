import cn from 'classnames'
import s from './RadioTypeButton.module.scss'

export default function RadioTypeButton({ list, value, onClick }) {
  return (
    <div className={s.cloud__toolbar}>
      {list?.map(btn => {
        return (
          <button
            className={cn(s.toolbar_btn, { [s.selected]: value === btn.value })}
            type="button"
            key={btn.value}
            onClick={() => onClick(btn.value)}
          >
            {btn.label}
          </button>
        )
      })}
    </div>
  )
}
