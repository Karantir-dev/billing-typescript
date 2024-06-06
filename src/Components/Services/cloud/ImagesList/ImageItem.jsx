import s from './ImagesList.module.scss'
import cn from 'classnames'

export default function ImageItem({ item, cells, itemOnClickHandler, idKey }) {
  return (
    <tr className={s.tr} onClick={e => itemOnClickHandler(e, item)}>
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
