/* eslint-disable no-unused-vars */
import s from './ImagesList.module.scss'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

export default function ImageItem({
  item,
  cells,
  itemOnClickHandler,
  idKey,
  isItemClickable,
}) {
  const { t } = useTranslation(['cloud_vps'])
  return (
    <tr
      className={cn(s.tr, { [s.disabled]: !isItemClickable })}
      onClick={e => itemOnClickHandler(e, item)}
    >
      {cells.map(cell => (
        <td
          key={`item_${item?.[idKey].$}${cell.label}`}
          data-target={cell.label}
          className={cn(s.td, s[cell.label])}
        >
          {}
          {['image_type', 'backup_type'].some(key => cell.value === key)
            ? t(item[cell.value]?.$)
            : cell.renderData?.(item[cell.value]?.$, item) ?? item[cell.value]?.$}
        </td>
      ))}
    </tr>
  )
}

ImageItem.propTypes = {
  item: PropTypes.object,
  cells: PropTypes.array,
  itemOnClickHandler: PropTypes.func,
  idKey: PropTypes.string,
}
