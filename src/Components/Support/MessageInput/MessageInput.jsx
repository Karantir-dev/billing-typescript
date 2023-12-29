import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import { Icon } from '@components'
import { Field, ErrorMessage } from 'formik'
import s from './MessageInput.module.scss'

export default function Component(props) {
  const {
    files,
    message,
    onChangeFiles,
    onKeyDown,
    filesError,
    enableFiles = true,
    fieldId = 'message'
  } = props
  const { t } = useTranslation(['support', 'other'])

  const textarea = useRef(null)
  useEffect(() => {
    textarea.current.style.height = '30px'
    const scrollHeight = textarea.current.scrollHeight
    textarea.current.style.height = scrollHeight + 'px'
  }, [message])

  return (
    <div className={s.messageContainer}>
      <div className={s.fieldsBlock}>
        <div className={s.messageBlock}>
          <Field
            data-testid="input_message"
            innerRef={textarea}
            className={s.textarea}
            type="text"
            name="message"
            id={fieldId}
            placeholder={t('Enter your message...')}
            as="textarea"
            onKeyDown={onKeyDown}
          />
          {enableFiles && (
            <label htmlFor="files">
              <div
                className={cn(s.filesBlock, {
                  [s.notEmpty]: files?.length > 0,
                })}
              >
                <Icon name="Clip" />
              </div>
              <input
                hidden
                accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, .pptx, .docx,
             application/pdf, image/*, audio/*, video/*, .zip, .rar, .html, .csv"
                disabled={files?.length === 5}
                id="files"
                name="files"
                type="file"
                onChange={e =>
                  e?.target?.files?.length !== 0 &&
                  onChangeFiles(files.concat(e.target.files[0]))
                }
              />
            </label>
          )}
        </div>
        {enableFiles && files?.length > 0 && (
          <div className={s.filesContainer}>
            {files?.map((el, index) => {
              return (
                <div
                  className={cn(s.fileItem, { [s.bigfile]: el?.size >= 10000000 })}
                  key={index}
                >
                  {el?.name}
                  <button
                    type="button"
                    onClick={() => {
                      let newArr = files
                        .slice(0, index)
                        .concat(files.slice(index + 1, files?.length))
                      onChangeFiles(newArr)
                    }}
                    className={s.fileDeleteItem}
                  >
                    <Icon name="Cross" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
      {filesError && (
        <div className={s.fileError}>
          {t('The size of the collected file should not exceed 10.0 MB')}
        </div>
      )}
      <ErrorMessage className={s.fileError} name={'message'} component="span" />
    </div>
  )
}
