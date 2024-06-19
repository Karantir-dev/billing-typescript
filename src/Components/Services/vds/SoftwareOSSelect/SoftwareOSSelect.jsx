import cn from 'classnames'
import { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Icon } from '@components'
import { selectors } from '@redux'
import { useOutsideAlerter, getImageIconName } from '@utils'

import s from './SoftwareOSSelect.module.scss'
import ss from '../../../ui/Select/Select.module.scss'
import { SOFTWARE_ICONS_LIST } from '@utils/constants'

export default function SoftwareOSSelect({
  iconName,
  itemsList,
  state,
  getElement,
  disabled,
}) {
  const dropdown = useRef(null)
  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  const [isOpened, setIsOpened] = useState(false)

  const initialState = itemsList?.find(item => item.value === state) || itemsList[0]

  const [selectedItem, setSelectedItem] = useState(initialState)

  useOutsideAlerter(dropdown, isOpened, () => setIsOpened(false))

  const itemSelectHandler = item => {
    setSelectedItem(item)
    getElement(item?.value)
    setIsOpened(false)
  }

  const inList = SOFTWARE_ICONS_LIST?.includes(iconName)

  const osIcon = getImageIconName(iconName, darkTheme)

  const renderImg = () => {
    if (inList) {
      return require(`@images/soft_os_icons/${osIcon}.png`)
    }

    return require(`@images/soft_os_icons/linux-logo${darkTheme ? '_dt' : ''}.png`)
  }

  return (
    <div className={cn(s.bg, { [s.selected]: selectedItem.value === state })}>
      <button
        className={s.btn}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpened(true)}
      >
        {iconName === 'iso' ? (
          <Icon name={'Iso'} />
        ) : (
          <img className={cn(s.img)} src={renderImg()} alt="icon" />
        )}

        <div>
          {selectedItem?.label} {selectedItem?.os_version?.$}{' '}
          {selectedItem?.architecture?.$ && (
            <span className={s.architecture}>{selectedItem?.architecture?.$}</span>
          )}
          {selectedItem?.$name && <p className={s.image_name}>{selectedItem?.$name}</p>}
        </div>

        <Icon name="Shevron" className={cn(ss.right_icon, { [ss.opened]: isOpened })} />
      </button>

      {itemsList.length !== 0 && (
        <div ref={dropdown} className={cn(ss.dropdown, { [ss.opened]: isOpened })}>
          <div className={s.list}>
            {itemsList?.map((el, index) => {
              return (
                <div
                  className={s.list_item}
                  onClick={() => itemSelectHandler(el)}
                  key={index}
                  tabIndex={0}
                  onKeyDown={null}
                  role="button"
                >
                  <img
                    className={cn(s.img, s.left, s.grey)}
                    src={renderImg()}
                    alt="icon"
                  />

                  <div>
                    {el.label} {el?.os_version?.$}{' '}
                    {el?.$name && <p className={s.image_name}>{el?.$name}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
