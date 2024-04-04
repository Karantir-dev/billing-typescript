import { Icon } from '@components'
import s from './CopyText.module.scss'
import { CSSTransition } from 'react-transition-group'
import { useState } from 'react'
import animations from './animations.module.scss'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

export default function CopyText({ text, className, promptText }) {
  const { t } = useTranslation(['affiliate_program'])
  const [refLinkCopied, setRefLinkCopied] = useState(false)

  const showPrompt = () => {
    setRefLinkCopied(true)

    setTimeout(() => {
      setRefLinkCopied(false)
    }, 2000)
  }

  const handleCopyText = () => {
    showPrompt()
    navigator.clipboard.writeText(text)
  }

  return (
    <button className={cn(s.copy_btn, className)} onClick={handleCopyText} type="button">
      <Icon name="Copy" className={s.copy_icon} />
      <CSSTransition
        in={refLinkCopied}
        classNames={animations}
        timeout={150}
        unmountOnExit
      >
        <div className={s.copy_prompt}>
          {promptText || t('about_section.link_copied')}
        </div>
      </CSSTransition>
    </button>
  )
}
