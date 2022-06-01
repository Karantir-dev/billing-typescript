import * as React from 'react'
import Gradient from './Gradient'
import { useSelector } from 'react-redux'
import { selectors } from '../../Redux'

export default function SvgComponent(props) {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'

  return (
    <svg
      width={12}
      height={16}
      viewBox="0 0 12 16"
      fill={darkTheme ? '#decbfe' : '#ae9ccd'}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M9.622 16h-7.56a.75.75 0 0 1-.748-.7l-.65-9.644a.75.75 0 0 1 .75-.8h8.857c.434 0 .777.368.748.8l-.648 9.643a.75.75 0 0 1-.75.701Zm2.137-12.55H.018C.008 3.45 0 3.441 0 3.43V1.378c0-.01.007-.018.018-.018h11.741c.01 0 .018.007.018.018v2.051c0 .011-.007.02-.018.02Z" />
      <path d="M9.014 2.37H2.74c-.011 0-.018-.007-.018-.018V.018c0-.01.007-.018.018-.018h6.274c.01 0 .018.007.018.018v2.334a.018.018 0 0 1-.018.018Z" />
      <Gradient />
    </svg>
  )
}
