import cn from 'classnames'
import { formatCountryName, getFlagFromCountryName } from '@src/utils'
import { useTranslation } from 'react-i18next'
import s from './CountryButton.module.scss'

export default function CountryButton({ currentItem, item, onChange, disabled }) {
  const { t } = useTranslation(['countries'])

  return (
    <li
      className={cn(s.category_item, {
        [s.selected]: currentItem.$key === item.$key && !disabled,
      })}
    >
      <button
        className={cn(s.category_btn)}
        type="button"
        onClick={() => onChange(item)}
        disabled={disabled}
      >
        <img
          className={s.flag}
          src={require(`@images/countryFlags/${getFlagFromCountryName(
            formatCountryName(item.$),
          )}.png`)}
          width={20}
          height={14}
          alt={formatCountryName(item.$)}
        />
        {t(item.$.split(' ')[0], { ns: 'countries' })}
      </button>
    </li>
  )
}
