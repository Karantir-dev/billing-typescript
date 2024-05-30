import cn from 'classnames'
import PropTypes from 'prop-types'
import s from './RadioTypeButton.module.scss'
import { TooltipWrapper, Icon } from '@components'
import { useMediaQuery } from 'react-responsive'

export default function RadioTypeButton({
  label,
  list,
  value,
  onClick,
  withCaption,
  captionText,
  popupClassName,
  toggleCaption,
}) {
  const widerThan1550 = useMediaQuery({ query: '(min-width: 1550px)' })

  return (
    <div className={s.wrapper}>
      {label && (
        <div className={s.label}>
          {label}:
          {withCaption && (
            <TooltipWrapper
              content={captionText}
              className={popupClassName}
              disabled={!widerThan1550}
              anchor="price_info"
            >
              <button type="button" onClick={toggleCaption}>
                <Icon name="Info" />
              </button>
            </TooltipWrapper>
          )}
        </div>
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
