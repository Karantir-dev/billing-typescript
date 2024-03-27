import cn from 'classnames'
import PropTypes from 'prop-types'
import s from './RadioTypeButton.module.scss'

export default function RadioTypeButton({ label, list, value, onClick, withCaption }) {
  return (
    <div className={s.wrapper}>
      {label && (
        <p className={s.label}>
          {label}:{withCaption && <span className="asterisk">*</span>}
        </p>
      )}

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
    </div>
  )
}

RadioTypeButton.propTypes = {
  label: PropTypes.string,
  list: PropTypes.array,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClick: PropTypes.func,
  withCaption: PropTypes.bool,
}
