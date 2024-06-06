import s from './ImagesList.module.scss'
import PropTypes from 'prop-types'

export default function ImageMobileItem({ item, cells, itemOnClickHandler, idKey }) {
  const nameField = cells.find(cell => cell.label === 'name')
  const optionsField = cells.find(cell => cell.label === 'options')

  return (
    <div
      className={s.mobile_item}
      onClick={e => itemOnClickHandler(e, item)}
      tabIndex={0}
      onKeyUp={() => {}}
      role="button"
    >
      <div className={s.mobile_item__header} data-target="options">
        <div className={s.mobile_item__header_name}>
          {nameField.renderData?.(item[nameField.value]?.$, item) ??
            item[nameField.value]?.$}
        </div>
        <div>{optionsField?.renderData(undefined, item)}</div>
      </div>
      <div className={s.mobile_item__body}>
        {cells.map(cell => {
          if (cell.label === 'name' || cell.label === 'options') return null
          return (
            <div
              className={s.mobile_item__value}
              key={`item_m_${item?.[idKey].$}${cell.label}`}
              data-target={cell.label}
            >
              {cell?.renderData?.(item[cell.value]?.$, item) ?? item[cell.value]?.$}
            </div>
          )
        })}
      </div>
    </div>
  )
}

ImageMobileItem.propTypes = {
  item: PropTypes.object,
  cells: PropTypes.array,
  itemOnClickHandler: PropTypes.func,
  idKey: PropTypes.string,
}
