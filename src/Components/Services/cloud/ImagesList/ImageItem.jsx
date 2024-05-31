/* eslint-disable no-unused-vars */
import s from './ImagesList.module.scss'
import cn from 'classnames'

export default function ImageItem({ item, cells }) {
  return (
    <tr className={s.tr}>
      {cells.map(cell => (
        <td key={`item_${item.id}${cell.label}`} className={cn(s.td, s[cell.label])}>
          {cell.renderData?.(item[cell.dataKey]) ?? item[cell.dataKey]}
        </td>
      ))}
    </tr>
  )
}
