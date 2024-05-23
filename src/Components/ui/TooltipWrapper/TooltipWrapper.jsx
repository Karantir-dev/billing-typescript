import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'react-tooltip'
import { useSelector } from 'react-redux'
import { selectors } from '@redux'
import cn from 'classnames'
import s from '../HintWrapper/HintWrapper.module.scss'

export default function TooltipWrapper({
  id,
  label,
  children,
  // popupClassName,
  wrapperClassName,
  delayShow = 500,
  place = 'top',
  effect = 'solid',
  disabled,
  hintDelay = 500,
}) {
  const currentTheme = useSelector(selectors.getTheme)
  const [theme, setTheme] = useState(currentTheme)

  useEffect(() => {
    setTheme(currentTheme)
  }, [currentTheme])

  const type = theme === 'dark' ? 'light' : 'dark'

  return (
    <>
      {disabled ? (
        children
      ) : (
        <div className={cn(s.hint_wrapper, wrapperClassName)} id={id}>
          {children}
          <Tooltip
            anchorSelect={`#${id}`}
            content={label}
            place={place}
            effect={effect}
            type={'light' || type}
            positionStrategy="fixed"
            delayShow={hintDelay || delayShow}
          />
        </div>
      )}
    </>
  )
}

TooltipWrapper.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  popupClassName: PropTypes.string,
  wrapperClassName: PropTypes.string,
  bottom: PropTypes.bool,
  disabled: PropTypes.bool,
  hintDelay: PropTypes.number,
}
