import * as React from 'react'
import Gradient from './Gradient'

export default function SvgComponent(props) {
  return (
    <svg width={15} height={11} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="m1 1 6.623 8L14 1" strokeWidth={1.5} />
      <Gradient />
    </svg>
  )
}
