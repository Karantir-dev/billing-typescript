import { Button, InputField, Modal, Select } from '@components'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import s from './ImagesModals.module.scss'

import { useState, useEffect } from 'react'
import { cloudVpsOperations } from '@redux'
import { useDispatch } from 'react-redux'
import { useCancelRequest, formatCountryName, getFlagFromCountryName } from '@src/utils'

export const CopyModal = ({ item, closeModal, onSubmit }) => {
  const dispatch = useDispatch()
  const { signal, setIsLoading } = useCancelRequest()
  const { t } = useTranslation(['cloud_vps', 'vds', 'other'])

  const validationSchema = Yup.object().shape({
    image_name: Yup.string()
      .required(t('Is a required field', { ns: 'other' }))
      .max(100, t('warnings.max_count', { ns: 'auth', max: 100 })),
    region: Yup.string().required(t('Is a required field', { ns: 'other' })),
  })

  // const [isShouldDelete, setIsShouldDelete] = useState(false)
  const [itemData, setItemData] = useState()
  const [dataCenterList, setDataCenterList] = useState([])

  useEffect(() => {
    dispatch(
      cloudVpsOperations.copyModal({
        elid: item?.id?.$,
        setItemData,
        signal,
        setIsLoading,
      }),
    )
  }, [])

  useEffect(() => {
    setDataCenterList(
      itemData?.slist
        ?.find(el => el?.$name === 'region')
        ?.val.map(el => ({ label: el.$, value: el.$key })),
    )
  }, [itemData])

  return (
    <Modal isOpen={!!item && !!itemData} closeModal={closeModal}>
      <Modal.Header>
        <p>{t('image.copy_title')}</p>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{
            image_name: '',
            region: itemData?.region?.$,
          }}
          validationSchema={validationSchema}
          onSubmit={values => {
            onSubmit({
              values: {
                image_name: values.image_name.trim(),
                region: values.region,
                sok: 'ok',
              },
              closeModal,
            })
          }}
        >
          {({ values, setFieldValue, errors, touched }) => {
            return (
              <Form id={'create_image_copy'}>
                <div className={s.copy_modal__wrapper}>
                  <Select
                    className={s.backup_rotation_select}
                    label={`${t('region')}:`}
                    name={'region'}
                    itemsList={dataCenterList?.map(el => {
                      const country = formatCountryName(el?.label)

                      return {
                        ...el,
                        label: (
                          <span className={s.row}>
                            <img
                              src={require(`@images/countryFlags/${getFlagFromCountryName(
                                country,
                              )}.png`)}
                              width={20}
                              height={14}
                              alt={country}
                            />
                            {el.label}
                          </span>
                        ),
                      }
                    })}
                    value={values.region}
                    getElement={value => setFieldValue('region', value)}
                    isRequired
                    isShadow
                  />

                  <InputField
                    className={s.copy_modal__input_wrapper}
                    name="image_name"
                    isShadow
                    label={`${t('name', { ns: 'vds' })}:`}
                    placeholder={t('server_placeholder', { ns: 'vds' })}
                    error={!!errors.name}
                    touched={!!touched.name}
                    isRequired
                    autoComplete="off"
                  />

                  {/* The component is not used. Probably, in the future, logic for it will be created on the back end */}

                  {/* <div className={s.copy_modal__checkbox_wrapper}>
                  <CheckBox
                    value={isShouldDelete}
                    id={'shouldDeleteSource'}
                    name={'shouldDeleteSource'}
                    onClick={() => setIsShouldDelete(!isShouldDelete)}
                    className={s.checkbox}
                  />
                  <label htmlFor="shouldDeleteSource">
                    Delete source image (move image)
                  </label>
                </div> */}
                </div>
              </Form>
            )
          }}
        </Formik>
      </Modal.Body>
      <Modal.Footer className={s.copy_modal__footer_wrapper}>
        <button type="button" className={s.cancel_btn} onClick={closeModal}>
          {t('Cancel')}
        </button>
        <Button
          label={t('create')}
          size={'large'}
          type="submit"
          form={'create_image_copy'}
          isShadow
        />
      </Modal.Footer>
    </Modal>
  )
}
