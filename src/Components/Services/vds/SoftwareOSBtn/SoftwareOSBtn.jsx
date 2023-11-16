import cn from 'classnames'

import { useSelector } from 'react-redux'
import { selectors } from '@redux'

import s from './SoftwareOSBtn.module.scss'
import { SOFTWARE_ICONS_LIST } from '@utils/constants'

export default function SoftwareOSBtn({ iconName, label, value, state, onClick }) {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'

  const icon =
    iconName === 'alma' ? 'almalinux' : iconName === 'astra' ? 'astralinux' : iconName

  const inList = SOFTWARE_ICONS_LIST?.includes(icon)

  const renderImg = () => {
    if (inList) {
      return require(`@images/soft_os_icons/${
        darkTheme ? icon + '_dt' : icon
      }.png`)
    }

    return require(`@images/soft_os_icons/linux-logo${darkTheme ? '_dt' : ''}.png`)
  }

  return (
    <div className={cn(s.bg, { [s.selected]: value === state })}>
      <button className={s.btn} onClick={() => onClick(value)} type="button">
        <img
          className={cn(s.img, `${icon === 'null' ? s.without : ''}`)}
          src={renderImg()}
          alt="icon"
        />

        {label}
      </button>
    </div>
  )
}
