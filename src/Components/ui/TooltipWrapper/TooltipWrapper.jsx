import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'react-tooltip'
import { useSelector } from 'react-redux'
import { selectors } from '@redux'
import cn from 'classnames'
import s from './TooltipWrapper.module.scss'

export default function TooltipWrapper({
  anchor,
  content,
  hintDelay, // old version of HintWrapper props
  children,
  className,
  wrapperClassName, // className wrapper is used in rare cases
  delayShow = 500,
  place = 'top',
  effect = 'solid',
  variant,
  disabled, // old version of HintWrapper props
  ...props
}) {
  const currentTheme = useSelector(selectors.getTheme)
  const [theme, setTheme] = useState(currentTheme)

  useEffect(() => {
    setTheme(currentTheme)
  }, [currentTheme])

  const themeVariant = theme === 'dark' ? 'light' : 'dark'

  return (
    <>
      {disabled ? (
        children
      ) : (
        <div className={wrapperClassName} id={anchor}>
          {children}
          <Tooltip
            anchorSelect={`#${anchor}`}
            className={cn(
              s.hint,
              {
                [s.default_theme]: !variant,
              },
              className,
            )}
            content={content}
            place={place}
            effect={effect}
            variant={variant || themeVariant}
            positionStrategy="fixed"
            delayShow={hintDelay || delayShow}
            {...props}
          />
        </div>
      )}
    </>
  )
}

TooltipWrapper.propTypes = {
  anchor: PropTypes.string.isRequired /* The selector for the anchor elements. */,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]) /* Content to be displayed in tooltip */,
  children:
    PropTypes.node /* The tooltip children have lower priority compared to the content */,
  className: PropTypes.string,
  wrapperClassName: PropTypes.string,
  delayShow: PropTypes.number /* The delay (in ms) before showing the tooltip */,
  hintDelay: PropTypes.number /* old version of HintWrapper for delayShow*/,
  place: PropTypes.oneOf([
    'top',
    'top-start',
    'top-end',
    'right',
    'right-start',
    'right-end',
    'bottom',
    'bottom-start',
    'bottom-end',
    'left',
    'left-start',
    'left-end',
  ]), // Position relative to the anchor element where the tooltip will be rendered (if possible)
  effect: PropTypes.oneOf([
    'solid',
    'float',
  ]) /* 'float' - Tooltip will follow the mouse position when it moves inside the anchor element */,
  variant: PropTypes.oneOf(['dark', 'light', 'success', 'warning', 'error', 'info']),
  disabled:
    PropTypes.bool /* To support disabling a component from a HintWrapper component */,
  ...Tooltip.propTypes /* include all prop types from Tooltip*/,
}
