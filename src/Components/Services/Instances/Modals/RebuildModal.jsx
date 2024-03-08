/* eslint-disable no-unused-vars */
import {
  Button,
  Icon,
  InputField,
  Modal,
  SoftwareOSBtn,
  SoftwareOSSelect,
} from '@components'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import s from './Modals.module.scss'
import cn from 'classnames'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { cloudVpsOperations } from '@redux'

export const RebuildModal = ({ item, closeModal, onSubmit }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [state, setState] = useState()

  useEffect(() => {
    dispatch(cloudVpsOperations.rebuildInstance({ elid: item.id.$, setState }))
  }, [])

  const renderSoftwareOSFields = (fieldName, current, depends) => {
    // const changeOSHandler = value =>
    //   fieldName === 'ostempl'
    //     ? setParameters(params => ({
    //         ...params,
    //         [fieldName]: { $: value },
    //         recipe: { $: 'null' },
    //       }))
    //     : setParameters(params => ({
    //         ...params,
    //         [fieldName]: { $: value },
    //       }))

    let dataArr = state?.slist?.find(el => el.$name === fieldName)?.val

    const elemsData = {}
    dataArr = dataArr?.filter(el => el.$depend === depends && el.$key !== 'null')

    dataArr?.forEach(element => {
      const itemName = element.$.match(/^(.+?)(?=-|\s|$)/g)

      if (!Object.prototype.hasOwnProperty.call(elemsData, itemName)) {
        elemsData[itemName] = [element]
      } else {
        elemsData[itemName].push(element)
      }
    })

    return Object.entries(elemsData).map(([name, el]) => {
      console.log(name, ' name')
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
            state={current}
            getElement={item => console.log(item)}
          />
        )
      } else {
        return (
          <SoftwareOSBtn
            key={el[0].$key}
            value={el[0].$key}
            state={current}
            iconName={name.toLowerCase()}
            label={el[0].$}
            onClick={item => console.log(item)}
          />
        )
      }
    })
  }

  console.log(state, ' state')

  return (
    <Modal isOpen={!!item} closeModal={closeModal} isClickOutside>
      <Modal.Header>
        <p>Rebuild</p>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ pricelist: '' }}
          onSubmit={values =>
            dispatch(
              cloudVpsOperations.changeTariff({
                elid: item.id.$,
                pricelist: values.pricelist,
                elname: item.name.$,
              }),
            )
          }
        >
          {({ values, setFieldValue }) => {
            return (
              <Form id={'delete'}>
                <div className={s.body}>
                  <p className={s.warning}>
                    <Icon name="Attention" />
                    All data currently on the instance disk will be permanently deleted.
                  </p>
                  <p className={s.body__text}>Select boot source</p>
                  <div>
                    {renderSoftwareOSFields('select_rebuild', values.ostempl, 'image')}
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
