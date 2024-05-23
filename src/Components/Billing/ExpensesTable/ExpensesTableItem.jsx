import s from './ExpensesTable.module.scss'
import PropTypes from 'prop-types'
import cn from 'classnames'
import dayjs from 'dayjs'
import { HintWrapper } from '@components'
// import { Tooltip } from 'react-tooltip'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { expensesTranslateFn } from '@utils'

export default function Component(props) {
  const { id, number, date, sum, name, tax } = props
  const { t } = useTranslation(['billing', 'other', 'dedicated_servers'])
  const mobile = useMediaQuery({ query: '(max-width: 1023px)' })

  const datetimeSeparate = string => {
    let date = dayjs(string).format('DD MMM YYYY')
    return date
  }

  return (
    <div className={s.item}>
      <div className={s.tableBlockFirst}>
        {mobile && <div className={s.item_title}>{t('Id')}:</div>}
        <div className={cn(s.item_text, s.first_item)}>{id}</div>
      </div>

      <div className={s.tableBlockSecond}>
        {mobile && <div className={s.item_title}>{t('Name', { ns: 'other' })}:</div>}
        {/* <HintWrapper
          wrapperClassName={s.transferBtn}
          label={expensesTranslateFn(name, t)}
        >
      </HintWrapper> */}

        <div className={cn(s.item_text, s.second_item)} id={`id${id}`}>
          {expensesTranslateFn(name, t)}
        </div>
        <HintWrapper forId={`id${id}`} label={expensesTranslateFn(name, t)} />
        {/* <Tooltip
          anchorSelect={`#id${id}`}
          className={s.transferBtn}
          place="top"
          effect="solid"
          type="dark"
          content={expensesTranslateFn(name, t)}
          positionStrategy="fixed"
          delayShow={500}
        /> */}
      </div>

      <div className={s.tableBlockThird}>
        {mobile && <div className={s.item_title}>{t('date', { ns: 'other' })}:</div>}
        <div className={cn(s.item_text, s.third_item)}>{datetimeSeparate(date)}</div>
      </div>
      <div className={s.tableBlockFourth}>
        {mobile && <div className={s.item_title}>{t('Sum', { ns: 'other' })}:</div>}
        <div className={cn(s.item_text, s.fourth_item)}>{t(sum)}</div>
      </div>
      <div className={s.tableBlockFifth}>
        {mobile && (
          <div className={s.item_title}>{t('Paid in payments', { ns: 'other' })}:</div>
        )}
        <div className={cn(s.item_text, s.fifth_item)}>{t(number || '-')}</div>
      </div>
      <div className={s.tableBlockSixth}>
        {mobile && <div className={s.item_title}>{t('Tax', { ns: 'other' })}:</div>}
        <div className={cn(s.item_text, s.sixth_item)}>{t(tax)}</div>
      </div>
    </div>
  )
}

Component.propTypes = {
  id: PropTypes.string,
  theme: PropTypes.string,
  date: PropTypes.string,
  status: PropTypes.string,
  unread: PropTypes.bool,
  setSelctedTicket: PropTypes.func,
  selected: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.bool]),
}

Component.defaultProps = {
  id: '',
  theme: '',
  date: '',
  status: '',
  unread: false,
  setSelctedTicket: () => null,
  selected: null,
}
