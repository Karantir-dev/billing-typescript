import React, { useRef, useState } from 'react'
import { Edit, CheckEdit } from '../../../images'
import { HintWrapper } from '../../index'
import { useOutsideAlerter } from '../../../utils'

import s from './EditCell.module.scss'
import cn from 'classnames'

export default function EditCell({
  originName,
  placeholder,
  onSubmit,
  lettersAmount = 13,
  isShadow,
  className,
}) {
  const [isEdit, setIsEdit] = useState(false)
  const [editName, setEditName] = useState('')

  const editField = useRef()

  const closeEditHandler = () => {
    setIsEdit(!isEdit)
    setEditName('')
  }

  useOutsideAlerter(editField, isEdit, closeEditHandler)

  const onSubmitHandler = () => {
    onSubmit(editName)
    setIsEdit(!isEdit)
  }

  return (
    <div
      style={isEdit ? { overflow: 'inherit' } : {}}
      className={cn(s.item, className)}
      ref={editField}
    >
      {!isEdit ? (
        <HintWrapper
          popupClassName={s.HintWrapper}
          label={originName}
          wrapperClassName={cn(s.hint)}
          disabled={!originName || (originName && originName?.length < lettersAmount)}
        >
          <button
            className={cn(s.edit_btn, {
              [s.placeholder]: editName === '' && originName === '',
              [s.shadow]: isShadow,
            })}
            onClick={() => {
              setIsEdit(!isEdit)
              setEditName(originName?.trim())
            }}
          >
            <span className={s.text}>{placeholder}</span>
            <Edit />
          </button>
        </HintWrapper>
      ) : (
        <form className={s.editBlock} onSubmit={onSubmitHandler}>
          <input
            placeholder={placeholder}
            value={editName}
            onChange={e => setEditName(e.target.value)}
            autoFocus={true}
          />
          <button className={s.editBtnOk} type="submit">
            <CheckEdit />
          </button>
        </form>
      )}
    </div>
  )
}
