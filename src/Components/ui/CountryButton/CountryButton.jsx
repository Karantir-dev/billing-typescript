import cn from 'classnames'
import { formatCountryName, getFlagFromCountryName } from '@src/utils'
import { useTranslation } from 'react-i18next'
import s from './CountryButton.module.scss'

export default function CountryButton({ currentItem, item, onChange }) {
  const { t } = useTranslation(['countries'])
  return (
    <li
      className={cn(s.category_item, {
        [s.selected]: currentItem.$key === item.$key,
      })}
      key={item.$key}
    >
      <button className={cn(s.category_btn)} type="button" onClick={() => onChange(item)}>
        <img
          className={s.flag}
          src={require(`@images/countryFlags/${getFlagFromCountryName(
            formatCountryName(item.$),
          )}.png`)}
          width={20}
          height={14}
          alt={formatCountryName(item.$)}
        />
        {t(formatCountryName(item.$), { ns: 'countries' })}
      </button>
    </li>
  )
}
