import { useState, useEffect } from 'react'
import Avatar from 'react-avatar-edit'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Cross } from '@images'
import { Button } from '../..'
import { settingsOperations, userSelectors, settingsActions } from '@redux'
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
        DataURIToBlob(resizeImage(preview)),
        avatarFile?.name,
        successfullLoading,
      ),
    )
  }

  const resizeImage = base64Str => {
    let img = new Image()
    img.src = base64Str
    let canvas = document.createElement('canvas')
    let MAX_WIDTH = 80
    let MAX_HEIGHT = 80
    let width = img.width
    let height = img.height

    if (width > height) {
      height *= MAX_WIDTH / width
      width = MAX_WIDTH
    } else {
      width *= MAX_HEIGHT / height
      height = MAX_HEIGHT
    }
    canvas.width = width
    canvas.height = height
    let ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, width, height)
    return canvas.toDataURL()
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
              exportQuality={1}
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
