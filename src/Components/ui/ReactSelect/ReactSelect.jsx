import Select from 'react-select'
import './ReactSelect.scss'

export default function RSelect({ label, ...props }) {
  return (
    <div className="rSelect">
      {label && <label className="rSelect__label">{label}</label>}
      <Select classNamePrefix="rSelect" {...props} />
    </div>
  )
}
