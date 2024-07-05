import cn from 'classnames'
import { useSelector } from 'react-redux'
import { selectors } from '@redux'
import { getImageIconName } from '@utils'
import { Icon } from '@components'

import s from './SoftwareOSBtn.module.scss'

export default function SoftwareOSBtn({
  iconName,
  label,
  imageData,
  value,
  state,
  onClick,
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

  const osIcon = getImageIconName(icon, darkTheme)

  const renderImg = () => {
    return require(`@images/soft_os_icons/${osIcon}.png`)
  }

  return (
    <div
      className={cn(s.bg, {
        [s.selected]: value === state && !disabled,
        [s.disabled]: disabled,
      })}
    >
      <button className={s.btn} onClick={() => onClick(value)} type="button">
        {iconName === 'iso' ? (
          <Icon name={'Iso'} />
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
