import * as React from 'react'

export default function SvgComponent(props) {
  return (
    <svg width={18} height={12} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M.47 5.47a.75.75 0 0 0 0 1.06l4.773 4.773a.75.75 0 1 0 1.06-1.06L2.061 6l4.242-4.243a.75.75 0 0 0-1.06-1.06L.47 5.47ZM18 5.25H1v1.5h17v-1.5Z"
        fill="#E433BE"
      />
    </svg>
  )
}
