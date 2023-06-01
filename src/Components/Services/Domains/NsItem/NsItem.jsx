import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { InputField } from '../../..'
import s from './NsItem.module.scss'
import { Trash } from '@images'

const nslists = ['ns0', 'ns1', 'ns2', 'ns3', 'ns_additional']
const zomroNS = ['ns1.zomro.net', 'ns2.zomro.ru', 'ns3.zomro.com', 'ns4.zomro.su']

export default function Component(props) {
  const { t } = useTranslation(['domains', 'other', 'payers'])

  const { select, errors, touched, setFieldValue, values } = props

  const [shownElem, setShownElem] = useState(3)

  const fillNsByZomroHandler = () => {
    setShownElem(3)

    nslists?.map((el, index) => {
      if (index + 1 <= zomroNS?.length) {
        if (select) {
          setFieldValue(`domainparam_${select}_${el}`, zomroNS[index])
        } else {
          setFieldValue(el, zomroNS[index])
        }
      }
    })
  }

  const deleteNsHandler = el => {
    const data = []
    nslists?.forEach((e, index) => {
      if (e !== el && index <= shownElem) {
        if (select) {
          data?.push(values[`domainparam_${select}_${e}`])
        } else {
          data?.push(values[e])
        }
      }
    })

    nslists?.forEach((e, index) => {
      if (select) {
        setFieldValue(`domainparam_${select}_${e}`, data[index])
      } else {
        setFieldValue(e, data[index])
      }
    })

    setShownElem(s => s - 1)
  }

  return (
    <div className={s.formFieldsBlock}>
      <div className={s.useZomroNS}>
        {t('Use the name servers')}:{' '}
        <button onClick={fillNsByZomroHandler} type="button">
          Zomro
        </button>
      </div>
      {nslists?.map((el, index) => {
        if (index > shownElem) {
          return
        }
        if (select) {
          return (
            <div key={`domainparam_${select}_${el}`} className={s.inputBlock}>
              <InputField
                inputWrapperClass={s.inputHeight}
                name={`domainparam_${select}_${el}`}
                label={`${t(el)}:`}
                placeholder={t('Enter text', { ns: 'other' })}
                isShadow
                className={s.input}
                error={!!errors[`domainparam_${select}_${el}`]}
                touched={!!touched[`domainparam_${select}_${el}`]}
              />
              {index > 1 && (
                <button
                  onClick={() => deleteNsHandler(el)}
                  type="button"
                  className={s.deleteNs}
                >
                  <Trash />
                </button>
              )}
            </div>
          )
        } else {
          return (
            <div key={el} className={s.inputBlock}>
              <InputField
                inputWrapperClass={s.inputHeight}
                name={`${el}`}
                label={`${t(el)}:`}
                placeholder={t('Enter text', { ns: 'other' })}
                isShadow
                className={s.input}
                error={!!errors[`${el}`]}
                touched={!!touched[`${el}`]}
              />
              {index > 1 && (
                <button
                  onClick={() => deleteNsHandler(el)}
                  type="button"
                  className={s.deleteNs}
                >
                  <Trash />
                </button>
              )}
            </div>
          )
        }
      })}
      {shownElem + 1 !== nslists?.length && (
        <button
          onClick={() => setShownElem(s => s + 1)}
          type="button"
          className={s.addNs}
        >
          <span>+</span> <span>{t('Add', { ns: 'payers' })}</span>
        </button>
      )}
    </div>
  )
}
