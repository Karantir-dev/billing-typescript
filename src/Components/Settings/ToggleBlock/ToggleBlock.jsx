import { useState } from 'react'
import cn from 'classnames'
import { useMediaQuery } from 'react-responsive'
import { Toggle, Icon } from '@components'
import { useTranslation } from 'react-i18next'
import s from './ToggleBlock.module.scss'

export default function Component(props) {
  const { item, setFieldValue } = props
  const { t } = useTranslation(['user_settings', 'other'])
  const mobile = useMediaQuery({ query: '(max-width: 767px)' })

  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={s.checkRow}>
      <div
        tabIndex={0}
        role="button"
        onKeyDown={() => null}
        onClick={() => setIsOpen(!isOpen)}
        className={s.notifName}
      >
        {t(item.name)} <Icon name="Shevron" className={cn(s.shevron, { [s.opened]: isOpen })} />
      </div>
      <div
        className={cn(s.columnBlock, {
          [s.mobileColumnBlock]: mobile,
          [s.mobileColumnBlockOpened]: isOpen,
        })}
      >
        <div className={s.column}>
          <div className={s.toggleName}>email</div>
          <Toggle
            setValue={value => setFieldValue(`${item.fieldName}_notice_ntemail`, value)}
            initialState={item?.emailValue === 'on'}
          />
        </div>
        <div className={s.column}>
          <div className={s.toggleName}>messenger</div>
          <Toggle
            setValue={value =>
              setFieldValue(`${item.fieldName}_notice_ntmessenger`, value)
            }
            initialState={item?.messengerValue === 'on'}
          />
        </div>
        {/* <div className={s.column}>
          <div className={s.toggleName}>sms</div>
          <Toggle
            setValue={value => setFieldValue(`${item.fieldName}_notice_ntsms`, value)}
            initialState={item?.smsValue === 'on'}
          />
        </div> */}
      </div>
    </div>
  )
}
