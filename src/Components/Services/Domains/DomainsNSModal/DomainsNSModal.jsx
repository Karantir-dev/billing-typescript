import { useState, useRef, useEffect } from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { InputField, Button, Icon } from '../../..'
import { Formik, Form } from 'formik'
import s from './DomainsNSModal.module.scss'

const nslists = ['ns0', 'ns1', 'ns2', 'ns3', 'ns_additional']

export default function Component(props) {
  const { t } = useTranslation(['domains', 'other'])

  const { names, closeNSModalHandler, NSData, NSEditDomainHandler } = props

  const [shownElem, setShownElem] = useState(1)

  const dropdownDescription = useRef(null)

  const [more, setMore] = useState(false)
  const [namesToRender, setNamesToRender] = useState(
    names?.length > 1 ? names?.slice(0, 1) : names,
  )

  const editHandler = values => {
    const data = { ...values, sok: 'ok' }
    NSEditDomainHandler(data, NSData?.domain_id)
  }

  const handleMoreBtn = e => {
    e.preventDefault()
    setMore(!more)
    setNamesToRender(!more ? names : names?.slice(0, 1))
  }

  useEffect(() => {
    if (NSData && NSData?.ns2 && NSData?.ns2?.length !== 0) {
      setShownElem(2)
    }
    if (NSData && NSData?.ns3 && NSData?.ns3?.length !== 0) {
      setShownElem(3)
    }
    if (NSData && NSData?.ns_additional && NSData?.ns_additional?.length !== 0) {
      setShownElem(4)
    }
  }, [NSData])

  return (
    <div className={s.modalBlock}>
      <div className={s.modalHeader}>
        <span className={s.headerText}>{t('Name servers')}</span>
        <Icon name="Cross" onClick={closeNSModalHandler} className={s.crossIcon} />
      </div>
      {NSData?.domain_id?.split(',')?.length > 1 && (
        <div className={s.namesBlock}>
          <p className={s.warning_text}>
            {t('Attention, edit few services', { ns: 'other' })}:
          </p>

          <div
            className={cn({
              [s.services_names_wrapper]: true,
              [s.active]: more,
            })}
          >
            {namesToRender?.map((item, idx) => {
              return (
                <span className={s.item} key={item}>
                  {item
                    ?.split(' (')[0]
                    ?.replace('for', t('for', { ns: 'dns' }))
                    ?.replace('domains', t('domains', { ns: 'dns' }))
                    ?.replace('DNS-hosting', t('dns', { ns: 'crumbs' }))}

                  {names.length <= 3 && idx === names.length - 1 ? '' : ', '}
                </span>
              )
            })}
          </div>
          {names?.length > 1 && (
            <button onClick={handleMoreBtn} className={s.hidden_area}>
              {!more
                ? t('and_more', {
                    ns: 'other',
                    value: +names.length - 1,
                  })
                : t('trusted_users.read_less', { ns: 'trusted_users' })}
            </button>
          )}
        </div>
      )}
      <Formik
        enableReinitialize
        initialValues={{
          ns0: NSData?.ns0 || '',
          ns1: NSData?.ns1 || '',
          ns2: NSData?.ns2 || '',
          ns3: NSData?.ns3 || '',
          ns_additional: NSData?.ns_additional || '',
        }}
        onSubmit={editHandler}
      >
        {({ errors, touched }) => {
          return (
            <Form>
              <div className={s.form}>
                <div className={s.formBlock}>
                  <div className={s.formFieldsBlock}>
                    {nslists?.map((el, index) => {
                      if (index > shownElem) {
                        return
                      }
                      return (
                        <div className={s.nsInputBlock} key={el}>
                          <InputField
                            inputWrapperClass={s.inputHeight}
                            name={el}
                            label={`${t(
                              el === 'ns_additional' ? 'Additional NS' : 'NS',
                            )}:`}
                            placeholder={t('Enter text', { ns: 'other' })}
                            isShadow
                            className={s.input}
                            error={!!errors[el]}
                            touched={!!touched[el]}
                          />
                          <button
                            type="button"
                            className={s.infoBtn}
                            style={{ zIndex: 2 * nslists?.length - index }}
                          >
                            <Icon name="Info" />
                            <div ref={dropdownDescription} className={s.descriptionBlock}>
                              {t('record_format')}
                            </div>
                          </button>
                        </div>
                      )
                    })}

                    {shownElem + 1 !== nslists?.length && (
                      <button
                        onClick={() => setShownElem(s => s + 1)}
                        type="button"
                        className={s.addNs}
                      >
                        <span>+</span> <span>{t('Add NS')}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className={s.btnBlock}>
                <Button
                  className={s.saveBtn}
                  isShadow
                  size="medium"
                  label={t('Save', { ns: 'other' })}
                  type="submit"
                />
                <button onClick={closeNSModalHandler} type="button" className={s.cancel}>
                  {t('Cancel', { ns: 'other' })}
                </button>
              </div>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
