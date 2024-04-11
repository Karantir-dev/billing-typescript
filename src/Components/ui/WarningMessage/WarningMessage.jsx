import { Icon } from '@components'
import cn from 'classnames'
import { forwardRef } from 'react'
import s from './WarningMessage.module.scss'

export default forwardRef(function WarningMessage({ children, className }, ref) {
  return (
    <div className={cn(s.warning, { [className]: className })} ref={ref}>
      <Icon name="Attention" />
      <p>{children}</p>
    </div>
  )
})
