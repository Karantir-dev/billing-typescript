import { Icon } from '@components'
import cn from 'classnames'
import { forwardRef } from 'react'
import s from './WarningMessage.module.scss'

export default forwardRef(function WarningMessage(
  { children, className, iconClassName, type },
  ref,
) {
  return (
    <div
      className={cn(s.warning, { [className]: className, [s.error]: type === 'error' })}
      ref={ref}
    >
      <Icon name="Attention" className={cn({ [iconClassName]: iconClassName })} />
      <p>{children}</p>
    </div>
  )
})
