import cn from 'classnames'

import { useSelector } from 'react-redux'
import { selectors } from '@redux'

import s from './SoftwareOSBtn.module.scss'
import { SOFTWARE_ICONS_LIST } from '@utils/constants'
import { Icon } from '@components'

export default function SoftwareOSBtn({
  iconName,
  label,
  imageData,
  value,
  state,
  onClick,
  svgIcon,
  disabled,
}) {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  console.log(imageData)
  const icon =
    iconName === 'alma'
      ? 'almalinux'
      : iconName === 'astra'
      ? 'astralinux'
      : iconName === 'noos'
      ? 'null'
      : iconName

  const inList = SOFTWARE_ICONS_LIST?.includes(icon)

  const renderImg = () => {
    if (inList) {
      return require(`@images/soft_os_icons/${darkTheme ? icon + '_dt' : icon}.png`)
    }

    return require(`@images/soft_os_icons/linux-logo${darkTheme ? '_dt' : ''}.png`)
  }

  return (
    <div className={cn(s.bg, { [s.selected]: value === state, [s.disabled]: disabled })}>
      <button className={s.btn} onClick={() => onClick(value)} type="button">
        {svgIcon ? (
          <Icon name={svgIcon} />
        ) : (
          <img
            className={cn(s.img, { [s.without]: icon === 'null' })}
            src={renderImg()}
            alt="icon"
          />
        )}
        <div>
          {label} {imageData?.os_version?.$}
          <span className={s.architecture}>{imageData?.architecture?.$}</span>
          {imageData?.image_name?.$ && (
            <p className={s.image_name}>{imageData?.image_name?.$}</p>
          )}
        </div>
      </button>
    </div>
  )
}
