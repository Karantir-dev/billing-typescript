import s from './ImagesList.module.scss'
import cn from 'classnames'

export default function ImageItem({ item, cells, itemOnClickHandler }) {
  return (
    <tr className={s.tr} onClick={e => itemOnClickHandler(e, item)}>
      {cells.map(cell => (
        <td
          key={`item_${item.id}${cell.label}`}
          data-target={cell.label}
          className={cn(s.td, s[cell.label])}
        >
          {cell.renderData?.(item[cell.dataKey]?.$ ?? item[cell.dataKey], item) ??
            item[cell.dataKey]?.$ ??
            item[cell.dataKey]}
        </td>
      ))}
    </tr>
  )
}
