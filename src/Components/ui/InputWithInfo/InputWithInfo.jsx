import { Icon, InputField } from '@components'
import s from './InputWithInfo.module.scss'

export default function InputWithInfo({ infoText, ...props }) {
  return (
    <div className={s.wrapper}>
      <InputField {...props} />
      <button type="button" className={s.btn}>
        <Icon name="Info" />
      </button>
      <div className={s.description}>{infoText}</div>
    </div>
  )
}
