import PropTypes from 'prop-types'
import { ErrorMessage } from 'formik'
import s from './WeekdaySelector.module.scss'
import { CheckBox } from '@components'
import { useTranslation } from 'react-i18next'

export default function WeekdaySelector({
  selectedDays,
  setSelectedDays,
  isRequired,
  name,
}) {
  const { t } = useTranslation(['cloud_vps', 'other'])

  const daysOfWeek = [
    { value: 1, label: t('Monday', { ns: 'other' }) },
    { value: 2, label: t('Tuesday', { ns: 'other' }) },
    { value: 3, label: t('Wednesday', { ns: 'other' }) },
    { value: 4, label: t('Thursday', { ns: 'other' }) },
    { value: 5, label: t('Friday', { ns: 'other' }) },
    { value: 6, label: t('Saturday', { ns: 'other' }) },
    { value: 0, label: t('Sunday', { ns: 'other' }) },
  ]

  const handleDayClick = dayValue => {
    const newSelectedDays = selectedDays.includes(dayValue)
      ? selectedDays.filter(day => day !== dayValue)
      : [...selectedDays, dayValue]
    setSelectedDays(newSelectedDays)
  }

  return (
    <div className={s.weekday__component}>
      <p className={s.weekday__label}>
        {t('day')}: {isRequired && <span className={s.required_star}>*</span>}
      </p>
      <div className={s.weekday__wrapper}>
        {daysOfWeek.map(day => (
          <div key={`day_${day.value}`} className={s.weekday__checkbox}>
            <CheckBox
              value={selectedDays.includes(day.value)}
              onClick={() => handleDayClick(day.value)}
              name={day.label}
              id={`checkbox-${day.value}`}
            ></CheckBox>
            <label htmlFor={`checkbox-${day.value}`} className={s.checkbox__label}>
              {day.label}
            </label>
          </div>
        ))}
      </div>
      <ErrorMessage className={s.error_message} name={name} component="span" />
    </div>
  )
}

WeekdaySelector.propTypes = {
  selectedDays: PropTypes.arrayOf(PropTypes.number).isRequired,
  setSelectedDays: PropTypes.func.isRequired,
  isRequired: PropTypes.bool,
  name: PropTypes.string,
}
