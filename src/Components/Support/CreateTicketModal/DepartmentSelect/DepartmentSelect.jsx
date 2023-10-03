import { useRef } from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Icon, CheckBox } from '@components'

import s from './DepartmentSelect.module.scss'

export default function Component(props) {
  const { t } = useTranslation('support')
  const { selected, value, title, setValue, description, checkboxId } = props

  const dropdownDescription = useRef(null)

  const parseDescription = (desc = '') => {
    const newString =
      desc
        ?.replace(/<!--[\s\S]*?--!?>/g, '')
        ?.replace(/<\/?[a-z][^>]*(>|$)/gi, '')
        ?.trim() || ''

    let headerText = ''
    let bodyText = ''
    let footerText = ''

    if (newString?.includes('Customer care department')) {
      headerText = t('Customer care department')
    }

    if (newString?.includes('Technical support department')) {
      headerText = t('Technical support department')
    }

    if (
      newString?.includes(
        'Contact our customer care department for assistance with non-technical issues, such as payments, service renewal, services change.',
      )
    ) {
      bodyText = t(
        'Contact our customer care department for assistance with non-technical issues, such as payments, service renewal, services change.',
      )
    }

    if (
      newString?.includes(
        'Select this department if your question is related to setting up servers, installing control panels, moving sites.',
      )
    ) {
      bodyText = t(
        'Select this department if your question is related to setting up servers, installing control panels, moving sites.',
      )
    }

    if (newString?.includes('Business hours: 24/7')) {
      footerText = t('Business hours: 24/7')
    }

    if (headerText?.length === 0 || bodyText?.length === 0 || footerText?.length === 0) {
      return newString
    }

    return (
      <>
        <b>{headerText}</b>
        <br />
        <br />
        <p>{bodyText}</p>
        <br />
        <i>{footerText}</i>
      </>
    )
  }

  return (
    <div
      className={cn(s.select, { [s.selected]: selected })}
    >
      <CheckBox id={checkboxId} value={selected} onClick={() => setValue(value)} type="radio" />

      <label htmlFor={checkboxId} className={s.title}>{t(title)}</label>
      <button type="button" className={s.infoBtn}>
        <Icon name="Info" />
        <div ref={dropdownDescription} className={s.descriptionBlock}>
          {parseDescription(description)}
        </div>
      </button>
    </div>
  )
}

Component.propTypes = {
  selected: PropTypes.bool,
  value: PropTypes.string,
  title: PropTypes.string,
  setValue: PropTypes.func,
  description: PropTypes.string,
  checkboxId: PropTypes.string,
}

Component.defaultProps = {
  selected: false,
  value: '',
  title: '',
  setValue: '',
  description: '',
  checkboxId: '',
}
