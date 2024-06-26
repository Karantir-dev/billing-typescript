/* eslint-disable no-unused-vars */
import s from './ImagesList.module.scss'
import cn from 'classnames'
import PropTypes from 'prop-types'

export default function ImageItem({
  item,
  cells,
  itemOnClickHandler,
  idKey,
  isItemClickable,
}) {
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
          {cell.renderData?.(item[cell.value]?.$, item) ?? item[cell.value]?.$}
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
