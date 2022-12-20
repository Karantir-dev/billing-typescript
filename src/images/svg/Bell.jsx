import * as React from 'react'
import Gradient from './Gradient'

export default function SvgComponent(props) {
  const { svgwidth, svgheight } = props

  return (
    <svg
      viewBox="0 0 21 24"
      width={svgwidth}
      height={svgheight}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M19.69 16.913a6.698 6.698 0 0 1-2.379-5.125V9c0-3.519-2.614-6.432-6-6.92V1a1 1 0 1 0-2 0v1.08c-3.386.488-6 3.401-6 6.92v2.788a6.705 6.705 0 0 1-2.387 5.133A1.752 1.752 0 0 0 2.062 20h16.5c.964 0 1.75-.785 1.75-1.75 0-.512-.224-.996-.622-1.337ZM10.312 24a3.756 3.756 0 0 0 3.674-3H6.638a3.756 3.756 0 0 0 3.674 3Z" />
    </svg>
  )
}
