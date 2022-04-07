import * as React from 'react'

export default function SvgComponent(props) {
  return (
    <svg width={18} height={12} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M17.53 6.53a.75.75 0 0 0 0-1.06L12.757.697a.75.75 0 0 0-1.06 1.06L15.939 6l-4.242 4.243a.75.75 0 0 0 1.06 1.06L17.53 6.53ZM0 6.75h17v-1.5H0v1.5Z"
        fill="#E433BE"
      />
    </svg>
  )
}
