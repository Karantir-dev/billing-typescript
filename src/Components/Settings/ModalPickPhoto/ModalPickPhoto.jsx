import React, { useState, useEffect } from 'react'
import Avatar from 'react-avatar-edit'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Cross } from '../../../images'
import { Button } from '../..'
import { settingsOperations, userSelectors, settingsActions } from '../../../Redux'
import s from './ModalPickPhoto.module.scss'

export default function Component(props) {
  const [image, setImage] = useState()
  const [preview, setPreview] = useState('')

  const dispatch = useDispatch()
  const userInfo = useSelector(userSelectors.getUserInfo)

  const { t } = useTranslation(['user_settings', 'other'])

  const { avatarFile, setAvatarFile } = props

  useEffect(() => {
    let reader = new FileReader()
    reader.onloadend = () => {
      setImage(reader.result)
    }
    reader.readAsDataURL(avatarFile)
  }, [avatarFile])

  function DataURIToBlob(dataURI) {
    const splitDataURI = dataURI.split(',')
    const byteString =
      splitDataURI[0].indexOf('base64') >= 0
        ? atob(splitDataURI[1])
        : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i)

    return new Blob([ia], { type: mimeString })
  }

  let onCrop = preview => {
    setPreview(preview)
  }

  const successfullLoading = () => {
    dispatch(settingsActions.setUpdateAvatar(preview))
    setAvatarFile()
  }

  const saveAvatarHandler = () => {
    dispatch(
      settingsOperations.setUserAvatar(
        userInfo?.$id,
        DataURIToBlob(preview),
        avatarFile?.name,
        successfullLoading,
      ),
    )
  }

  return (
    <div className={s.modalBg}>
      <div className={s.modalBlock}>
        <div className={s.modalHeader}>
          <h2>{t('Upload a photo')}</h2>
          <Cross onClick={() => setAvatarFile()} className={s.cross} />
        </div>
        <div className={s.cropBlock}>
          {image && (
            <Avatar
              closeIconColor={'transparent'}
              imageWidth={235}
              onCrop={onCrop}
              src={image}
              exportSize={80}
              //   exportAsSquare
            />
          )}
          <div className={s.rightBlock}>
            <img className={s.cropPreview} src={preview} alt="preview" />
            <Button
              className={s.saveBtn}
              onClick={saveAvatarHandler}
              isShadow
              size="medium"
              label={t('Save', { ns: 'other' })}
              type="button"
            />
            <button onClick={() => setAvatarFile()} type="button" className={s.cancel}>
              {t('Cancel', { ns: 'other' })}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
