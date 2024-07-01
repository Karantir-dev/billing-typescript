import { useEffect, useRef, useState } from 'react'
import { Icon } from '@components'

import s from './EditCell.module.scss'
import cn from 'classnames'

export default function EditCell({
  originName,
  placeholder,
  onSubmit,
  isShadow,
  className,
  onChange,
}) {
  const [isEdit, setIsEdit] = useState(false)
  const [editName, setEditName] = useState('')

  const editField = useRef()
  const input = useRef()

  const closeEditHandler = () => {
    setIsEdit(false)
    setEditName('')
  }

  const onSubmitHandler = () => {
    onSubmit(editName)
    setIsEdit(!isEdit)
  }

  const activateEditMode = () => {
    setIsEdit(true)
    setEditName(originName?.trim())
  }

  useEffect(() => {
    const handleClickOutside = () => {
      if (editField.current && !editField.current.contains(event.target) && isEdit) {
        closeEditHandler()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isEdit])

  const handleChange = e => {
    const value = e.target.value
    const isValid = onChange?.(value)

    /* Update editName if onChange returns undefined (no validation = backward compatibility) or true (valid input) */
    if (typeof isValid === 'undefined' || isValid) {
      setEditName(value)
    }
  }

  return (
    <div
      style={isEdit ? { overflow: 'inherit' } : {}}
      className={cn(s.item, className)}
      ref={editField}
    >
      {!isEdit ? (
        <button
          className={cn(s.edit_btn, {
            [s.placeholder]: editName === '' && originName === '',
            [s.shadow]: isShadow,
          })}
          onMouseDown={activateEditMode}
        >
          <span className={s.text}>{placeholder}</span>
          <Icon name="Edit" />
        </button>
      ) : (
        <form className={s.editBlock} onSubmit={onSubmitHandler}>
          <input
            placeholder={placeholder}
            value={editName}
            onChange={handleChange}
            onMouseUp={() => input.current.focus()}
            ref={input}
          />
          <Icon
            name="Edit"
            className={cn(s.btn, s.edit_icon, { [s.btn_show]: originName === editName })}
          />
          <button
            className={cn(s.btn__check, s.btn, { [s.btn_show]: originName !== editName })}
            type="submit"
          >
            <Icon name="CheckEdit" />
          </button>
        </form>
      )}
    </div>
  )
}
