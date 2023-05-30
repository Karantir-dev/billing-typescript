import React, { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { useSelector, useDispatch } from 'react-redux'
import { Formik, Form } from 'formik'
import { CSSTransition } from 'react-transition-group'
import { useTranslation } from 'react-i18next'
import { Cross, Copy } from '../../../images'
import { InputField, Button } from '../..'
import {
  settingsActions,
  settingsOperations,
  settingsSelectors,
  userSelectors,
} from '../../../Redux'
import * as Yup from 'yup'
import animations from './animations.module.scss'
import s from './ModalTwoStepVerification.module.scss'
import Clock from './Clock'

export default function Component(props) {
  const dispatch = useDispatch()

  const [refLinkCopied, setRefLinkCopied] = useState(false)
  const [showMore, setShowMore] = useState(false)

  const refLinkEl = useRef(null)

  const twoStepVerif = useSelector(settingsSelectors.getTwoStepVerif)
  const userInfo = useSelector(userSelectors.getUserInfo)

  const { t } = useTranslation(['user_settings', 'other', 'support'])

  const { setModal } = props

  const validationSchema = Yup.object().shape({
    qrcode: Yup.string()
      .min(6, t('Password must contain at least 6 characters', { ns: 'other' }))
      .required(t('Is a required field', { ns: 'support' })),
  })

  const showPrompt = fn => {
    fn(true)

    setTimeout(() => {
      fn(false)
    }, 2000)
  }

  useEffect(() => {
    dispatch(settingsOperations.getQR(twoStepVerif?.qrimage))
  }, [])

  const saveSecretKeyHandler = () => {
    dispatch(settingsOperations.getSecretKeyFile())
  }

  const closeModalHandler = () => {
    dispatch(settingsActions.clearTwoStepVerif())
    setModal(false)
  }

  const downloadQrHandler = () => {
    const link = document.createElement('a')
    link.href = twoStepVerif?.qrimage
    link.setAttribute('download', 'QRcode.png')
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
  }

  const handleCopyText = el => {
    if (el.current === refLinkEl.current) {
      showPrompt(setRefLinkCopied)
      navigator.clipboard.writeText(el.current.textContent)
    }
  }

  const sendPasswrodHandler = values => {
    dispatch(settingsOperations.setTotpPassword(userInfo?.$id, values, setModal))
  }

  return (
    <div className={s.modalBlock}>
      <div className={s.modalHeader}>
        <h2>{t('2-Step Verification')}</h2>
        <Cross onClick={closeModalHandler} className={s.cross} />
      </div>
      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={{
          qrcode: '',
          secret: twoStepVerif?.secret || '',
          email: userInfo?.$email || '',
        }}
        onSubmit={sendPasswrodHandler}
      >
        {({ errors, touched, values, setFieldValue }) => {
          const onInputItemsChange = text => {
            let value = text.replace(/\D/g, '')
            if (value.length === 0) {
              value = ''
            }
            setFieldValue('qrcode', value)
          }

          return (
            <Form className={s.form}>
              <div className={s.mobileScroll}>
                <div className={s.qrInstruction}>
                  <div className={cn(s.instruction, { [s.showMore]: showMore })}>
                    <p>{t('Two Step Instruction')}</p>
                    <p>
                      {t(
                        'Make sure that time difference between the server and the phone is less than 1 minute.',
                      )}
                    </p>
                    <p className={s.important}>{t('Important!')}</p>
                    <p>{t('Two step warning')}</p>
                  </div>
                  <button onClick={() => setShowMore(!showMore)} className={s.readMore}>
                    {t(showMore ? 'Collapse' : 'Read more')}
                  </button>
                  <div className={s.qrBlock}>
                    <img className={s.qrImage} src={twoStepVerif?.qrimage} alt="qrCode" />
                    <button onClick={downloadQrHandler} className={s.btnSave}>
                      {t('Save QR code')}
                    </button>
                    <button onClick={saveSecretKeyHandler} className={s.btnSave}>
                      {t('Save key')}
                    </button>
                  </div>
                </div>
                <div className={s.fieldsRow}>
                  <div className={s.field_wrapper}>
                    <label className={s.label}>{t('Key')}:</label>
                    <div
                      className={cn(s.copy_field, s.field_bg)}
                      onClick={() => handleCopyText(refLinkEl)}
                      role="button"
                      tabIndex={0}
                      onKeyUp={() => {}}
                      data-testid={'ref_link_field'}
                    >
                      <span className={s.field_text} ref={refLinkEl}>
                        {twoStepVerif?.secret}
                      </span>
                      <Copy className={s.copy_icon} />

                      <CSSTransition
                        in={refLinkCopied}
                        classNames={animations}
                        timeout={150}
                        unmountOnExit
                      >
                        <div className={s.copy_prompt}>
                          <div className={s.prompt_pointer}></div>
                          {t('Key copied')}
                        </div>
                      </CSSTransition>
                    </div>
                  </div>
                  <InputField
                    className={s.passInput}
                    background
                    type="text"
                    label={`${t('A temporary password')}:`}
                    placeholder={t('Enter password')}
                    isShadow
                    value={values?.qrcode}
                    onChange={e => onInputItemsChange(e?.target?.value)}
                    name="qrcode"
                    error={!!errors.qrcode}
                    touched={!!touched.qrcode}
                    inputClassName={s.field_bg}
                  />
                </div>
                <div className={s.timeRow}>
                  <div className={s.timeBlock}>
                    <div className={s.timeName}>{t('Server time')}:</div>
                    <div className={s.time}>
                      <Clock date={twoStepVerif?.servertime} />
                    </div>
                  </div>
                  <div className={s.timeBlock}>
                    <div className={s.timeName}>{t('Current time')}:</div>
                    <div className={s.time}>
                      <Clock date={twoStepVerif?.actualtime} />
                    </div>
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
                <button onClick={closeModalHandler} type="button" className={s.cancel}>
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
