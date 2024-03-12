/* eslint-disable no-unused-vars */
import { Button, Icon, InputField, Modal, WarningMessage } from '@components'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import s from './Modals.module.scss'
import cn from 'classnames'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { cloudVpsOperations } from '@redux'

export const ResizeModal = ({ item, closeModal, onSubmit }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [tariffs, setTariffs] = useState()

  useEffect(() => {
    dispatch(cloudVpsOperations.getTariffsListToChange(item.id.$, setTariffs, closeModal))
  }, [])

  return (
    <Modal isOpen={!!item && !!tariffs} closeModal={closeModal} isClickOutside>
      <Modal.Header>
        <p>Choose a flavor</p>
        <p className={s.modal__subtitle}>
          <span className={s.modal__subtitle_transparent}>Instance:</span> {item.id.$}
        </p>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ pricelist: '' }}
          onSubmit={values =>
            dispatch(
              cloudVpsOperations.changeTariff({
                elid: item.id.$,
                pricelist: values.pricelist,
                successCallback: closeModal,
              }),
            )
          }
        >
          {({ values, setFieldValue }) => {
            return (
              <Form id={'delete'}>
                <div className={s.body}>
                  <WarningMessage>
                    Warning: instance resize will cause downtime. The instance will
                    shutdown and the disk image will be copied to a new disk. This may
                    take a while, depending on the disk size.
                  </WarningMessage>
                  <p className={s.body__text_small}>
                    Notes: you can only select flavors larger than your current flavor.
                    After the resize is completed, the instance will have the state
                    &quot;VERIFY RESIZE&quot;. Check if everything is ok with your data
                    and then click on &quot;Confirm resize&quot; in the instance menu.
                  </p>

                  <div className={s.tariff_list}>
                    {tariffs?.map(item => {
                      return (
                        <button
                          type="button"
                          key={item.$key}
                          onClick={() => setFieldValue('pricelist', item.$key)}
                          className={cn(s.tariff, {
                            [s.tariff_active]: values.pricelist === item.$key,
                          })}
                        >
                          {item.$}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </Form>
            )
          }}
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        <Button label="Delete" size="small" type="submit" form={'delete'} isShadow />
        <button type="button" onClick={closeModal}>
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  )
}
