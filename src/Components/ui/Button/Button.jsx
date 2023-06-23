import s from './Button.module.scss'
import PropTypes from 'prop-types'
import cn from 'classnames'

export default function Component(props) {
  const {
    label,
    type,
    onClick,
    disabled,
    size,
    isShadow,
    className,
    dataTestid,
    loading,
    form,
  } = props

  return (
    <button
      data-testid={dataTestid}
      disabled={disabled}
      className={cn({
        [s.btn]: true,
        [s.disabled]: disabled,
        [s.shadow]: isShadow,
        [s.block]: size === 'block',
        [s.small]: size === 'small',
        [s.medium]: size === 'medium',
        [s.large]: size === 'large',
        [className]: className,
      })}
      type={type}
      onClick={onClick}
      form={form}
    >
      {loading ? (
        <div className={s.loader}>
          <div className={cn(s.loader_circle, s.first)}></div>
          <div className={cn(s.loader_circle, s.second)}></div>
          <div className={s.loader_circle}></div>
        </div>
      ) : (
        <span className={s.btn_text}>{label}</span>
      )}
    </button>
  )
}

Component.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  dataTestid: PropTypes.string,
  type: PropTypes.oneOf(['button', 'reset', 'submit']),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  isShadow: PropTypes.bool,
  size: PropTypes.oneOf(['block', 'small', 'medium', 'large', '']),
  loading: PropTypes.bool,
}

Component.defaultProps = {
  label: 'Button',
  type: 'button',
  onClick: () => null,
  disabled: false,
  size: '',
  isShadow: false,
  dataTestid: null,
  loading: false,
}
