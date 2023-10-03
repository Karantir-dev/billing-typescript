import { useEffect, useState } from 'react'
import cn from 'classnames'
import { useMediaQuery } from 'react-responsive'
import { Icon, CheckBox } from '@components'
import { useTranslation } from 'react-i18next'
import s from './ToggleBlock.module.scss'

export default function Component(props) {
  const { item, setFieldValue, values } = props
  const { t } = useTranslation(['user_settings', 'other'])
  const mobile = useMediaQuery({ query: '(max-width: 767px)' })

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const keys = Object.keys(values)

    if (!keys.includes(`${item.fieldName}_notice_ntemail`)) {
      setFieldValue(`${item.fieldName}_notice_ntemail`, item?.emailValue === 'on')
    }
    if (!keys.includes(`${item.fieldName}_notice_ntmessenger`)) {
      setFieldValue(`${item.fieldName}_notice_ntmessenger`, item?.messengerValue === 'on')
    }
  }, [values])

  return (
    <div className={s.checkRow}>
      <div
        tabIndex={0}
        role="button"
        onKeyDown={() => null}
        onClick={() => setIsOpen(!isOpen)}
        className={s.notifName}
      >
        {t(item.name)}
        <Icon name="Shevron" className={cn(s.shevron, { [s.opened]: isOpen })} />
      </div>
      <div
        className={cn(s.columnBlock, {
          [s.mobileColumnBlock]: mobile,
          [s.mobileColumnBlockOpened]: isOpen,
        })}
      >
        <div className={s.column}>
          <div className={s.toggleName}>email</div>
          <CheckBox
            value={values[`${item.fieldName}_notice_ntemail`]}
            onClick={() => {
              setFieldValue(
                `${item.fieldName}_notice_ntemail`,
                !values[`${item.fieldName}_notice_ntemail`],
              )
            }}
            type="switcher"
          />
        </div>
        <div className={s.column}>
          <div className={s.toggleName}>messenger</div>
          <CheckBox
            value={values[`${item.fieldName}_notice_ntmessenger`]}
            onClick={() => {
              setFieldValue(
                `${item.fieldName}_notice_ntmessenger`,
                !values[`${item.fieldName}_notice_ntmessenger`],
              )
            }}
            type="switcher"
          />
        </div>
      </div>
    </div>
  )
}
