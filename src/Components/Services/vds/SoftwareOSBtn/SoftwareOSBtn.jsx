import cn from 'classnames'

import { useSelector } from 'react-redux'
import { selectors } from '@redux'

import { SOFTWARE_ICONS_LIST } from '@utils/constants'
import { Icon } from '@components'
import s from './SoftwareOSBtn.module.scss'

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

  const icon =
    iconName === 'alma'
      ? 'almalinux'
      : iconName === 'astra'
        ? 'astralinux'
        : iconName === 'noos'
          ? 'null'
          : iconName

  const inList = SOFTWARE_ICONS_LIST?.includes(icon)
  const svgIconInList = SOFTWARE_ICONS_LIST?.includes(svgIcon) || svgIcon === 'Iso'

  const renderImg = () => {
    if (inList) {
      return require(`@images/soft_os_icons/${darkTheme ? icon + '_dt' : icon}.png`)
    }

    return require(`@images/soft_os_icons/linux-logo${darkTheme ? '_dt' : ''}.png`)
  }

  return (
    <div
      className={cn(s.bg, {
        [s.selected]: value === state && !disabled,
        [s.disabled]: disabled,
      })}
    >
      <button className={s.btn} onClick={() => onClick(value)} type="button">
        {svgIcon ? (
          svgIconInList ? (
            <Icon name={svgIcon} />
          ) : (
            <Icon name="DefaultOs" />
          )
        ) : (
          <img
            className={cn(s.img, { [s.without]: icon === 'null' })}
            src={renderImg()}
            alt="icon"
          />
        )}
        <div>
          {label} {imageData?.os_version?.$}
          {imageData?.$name && <p className={s.image_name}>{imageData?.$name}</p>}
        </div>
      </button>
    </div>
  )
}
