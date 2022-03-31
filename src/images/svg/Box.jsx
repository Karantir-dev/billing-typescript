import * as React from 'react'
import Gradient from './Gradient'

export default function SvgComponent(props) {
  const { className } = props
  return (
    <svg width={27} height={26} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g className={className} clipPath="url(#a)" fill="#D9D0EB">
        <path
          className={className}
          d="M16.708 4.621v-.006l4.803 2.149 4.822-1.806L13.499.149.666 4.958l12.833 4.808 4.803-1.8L13.5 5.988v-.005l3.209-1.362ZM.666 6.56v14.425l12.031 4.509V11.069L.666 6.561Zm6.417 14.478-3.209-1.202v-1.71l3.209 1.202v1.71ZM21.52 8.364v4.014l-3.208 1.203V9.566l-4.01 1.503v14.425l12.03-4.509V6.561L21.52 8.364Z"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" transform="translate(.666)" d="M0 0h25.667v25.644H0z" />
        </clipPath>
      </defs>
      <Gradient />
    </svg>
  )
}
