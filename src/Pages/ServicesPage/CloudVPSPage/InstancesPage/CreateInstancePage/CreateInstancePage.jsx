/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { BreadCrumbs, Loader, SoftwareOSSelect, SoftwareOSBtn } from '@components'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { cloudVpsOperations } from '@src/Redux'
import { getFlagFromCountryName, useCancelRequest } from '@src/utils'

import s from './CreateInstancePage.module.scss'
import cn from 'classnames'
import { Form, Formik } from 'formik'

export default function CreateInstancePage() {
  const location = useLocation()
  const dispatch = useDispatch()

  const { t } = useTranslation([])

  const [dcList, setDcList] = useState()
  const [currentDC, setCurrentDC] = useState()

  const { signal, isLoading, setIsLoading } = useCancelRequest()

  useEffect(() => {
    dispatch(
      cloudVpsOperations.getCloudOrderPageInfo({ signal, setIsLoading, setDcList }),
    )
  }, [])

  const renderSoftwareOSFields = (fieldName, setFieldValue, state, ostempl) => {
    let dataArr = parametersInfo.slist.find(el => el.$name === fieldName)?.val
    const elemsData = {}
    if (fieldName === 'recipe') {
      dataArr = dataArr?.filter(el => el.$depend === ostempl && el.$key !== 'null')
      elemsData.null = [{ $key: 'null', $: t('without_software') }]
    }

    dataArr?.forEach(element => {
      const itemName = element.$.match(/^(.+?)(?=-|\s|$)/g)

      if (!Object.prototype.hasOwnProperty.call(elemsData, itemName)) {
        elemsData[itemName] = [element]
      } else {
        elemsData[itemName].push(element)
      }
    })

    return Object.entries(elemsData).map(([name, el]) => {
      if (el.length > 1) {
        const optionsList = el.map(({ $key, $ }) => ({
          value: $key,
          label: $,
        }))

        return (
          <SoftwareOSSelect
            key={optionsList[0].value}
            iconName={name.toLowerCase()}
            itemsList={optionsList}
            state={state}
            getElement={value => {
              setFieldValue(fieldName, value)
              if (fieldName === 'ostempl') {
                setRecipe('null')
                parametersInfo[fieldName].$ = value
                setParametersInfo({ ...parametersInfo })
              } else {
                setRecipe(value)
              }
            }}
          />
        )
      } else {
        return (
          <SoftwareOSBtn
            key={el[0].$key}
            value={el[0].$key}
            state={state}
            iconName={name.toLowerCase()}
            label={el[0].$}
            onClick={value => {
              if (fieldName === 'ostempl') {
                setRecipe('null')
                parametersInfo[fieldName].$ = value
                setParametersInfo({ ...parametersInfo })
              } else {
                setRecipe(value)
              }
            }}
          />
        )
      }
    })
  }

  return (
    <div>
      <BreadCrumbs pathnames={location?.pathname.split('/')} />
      <h2 className="page_title">{t('create_instance', { ns: 'crumbs' })} </h2>
      <h3 className={s.section_title}>{t('server_location')}</h3>

      <ul className={s.categories_list}>
        {dcList?.map(({ $key, $ }) => {
          return (
            <li
              className={cn(s.category_item, { [s.selected]: currentDC === $key })}
              key={$key}
            >
              <button
                className={cn(s.category_btn)}
                type="button"
                onClick={() => setCurrentDC($key)}
              >
                <img
                  className={s.flag}
                  src={require(`@images/countryFlags/${getFlagFromCountryName(
                    $.replace('Fotbo ', ''),
                  )}.png`)}
                  width={20}
                  height={14}
                  alt={$.replace('Fotbo ', '')}
                />
                {t($)}
              </button>
            </li>
          )
        })}
      </ul>

      <h3 className={s.section_title}>{t('server_image')}</h3>

      <Formik
        enableReinitialize
        initialValues={{
          ostempl: dataFromSite?.ostempl || parametersInfo?.ostempl?.$ || '',
          autoprolong: dataFromSite?.autoprolong || parametersInfo?.autoprolong?.$ || '',
        }}
        validationSchema={validationSchema}
        onSubmit={onFormSubmit}
      >
        {({ values, setFieldValue, errors, touched }) => {
          return (
            <Form>
              {/* <div className={cn(s.buying_panel, { [s.opened]: parametersInfo })}>
                  {widerThanMobile && (
                    <div className={s.buying_panel_item}>
                      <p>{t('amount')}:</p>

                      <div className={s.increment_wrapper}>
                        <button
                          className={cn(s.count_btn, s.decrement)}
                          type="button"
                          onClick={() => {
                            setCount(+count - 1)
                            setFieldValue(
                              'finalTotalPrice',
                              roundToDecimal(+(values.totalPrice * (+count - 1))),
                            )
                          }}
                          disabled={+count <= 1}
                        ></button>
                        <div className={s.input_wrapper_border}>
                          <div className={s.input_wrapper_bg}>
                            <div className={s.input_wrapper}>
                              <input
                                className={cn(s.count_input, s.amount_digit)}
                                value={count}
                                onChange={event => {
                                  const value =
                                    event.target.value.length > 1
                                      ? event.target.value?.replace(/^0/, '')
                                      : event.target.value

                                  setCount(+event.target.value > 35 ? 35 : value)
                                }}
                                onBlur={event => {
                                  if (event.target.value < 1) setCount(1)
                                }}
                                type="number"
                                min={1}
                                max={35}
                              />
                            </div>
                          </div>
                        </div>
                        <button
                          className={cn(s.count_btn, s.increment)}
                          type="button"
                          onClick={() => {
                            setCount(+count + 1)
                            setFieldValue(
                              'finalTotalPrice',
                              roundToDecimal(+(values.totalPrice * (+count + 1))),
                            )
                          }}
                          disabled={+count >= 35}
                        ></button>
                      </div>
                    </div>
                  )}

                  {widerThanMobile ? (
                    <p className={s.buying_panel_item}>
                      {t('topay', { ns: 'dedicated_servers' })}:
                      <span className={s.tablet_price_sentence}>
                        <span className={s.tablet_price}>
                          {roundToDecimal(values.finalTotalPrice - checkSaleMemory())} EUR
                        </span>
                        {` ${translatePeriodName(period, t)}`}
                      </span>
                    </p>
                  ) : (
                    <p className={s.price_wrapper}>
                      <span className={s.price}>
                        €{roundToDecimal(values.finalTotalPrice - checkSaleMemory())}
                      </span>
                      {` ${translatePeriodName(period, t)}`}
                      
                    </p>
                  )}

                  <Button
                    className={s.btn_buy}
                    label={t('buy', { ns: 'other' })}
                    type="submit"
                    isShadow
                    onClick={() => {
                      values.agreement === 'off' &&
                        agreementEl.current.scrollIntoView({
                          behavior: 'smooth',
                        })
                    }}
                  />
                </div> */}
            </Form>
          )
        }}
      </Formik>

      {isLoading && <Loader local shown={isLoading} />}
    </div>
  )
}
