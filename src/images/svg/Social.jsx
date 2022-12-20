import * as React from 'react'

export default function SvgComponent(props) {
  const { className } = props
  return (
    <svg width={26} height={27} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        className={className}
        d="M3.753 14.852h2.01a5.23 5.23 0 0 0-.316 1.797v7.6c0 .263.046.516.13.75H2.251A2.254 2.254 0 0 1 0 22.748v-4.143a3.757 3.757 0 0 1 3.753-3.753ZM20.553 16.65c0-.632-.112-1.237-.317-1.798h2.01A3.757 3.757 0 0 1 26 18.605v4.143A2.255 2.255 0 0 1 23.748 25h-3.324c.083-.235.129-.488.129-.751v-7.6ZM10.702 12.896h4.597a3.758 3.758 0 0 1 3.753 3.753v7.6a.75.75 0 0 1-.75.75H7.698a.75.75 0 0 1-.75-.75v-7.6a3.758 3.758 0 0 1 3.753-3.754ZM13 2.944a4.519 4.519 0 0 1 4.514 4.514A4.517 4.517 0 0 1 13 11.972a4.517 4.517 0 0 1-4.514-4.514A4.519 4.519 0 0 1 13 2.944ZM20.926 7.151a3.38 3.38 0 0 1 3.376 3.376 3.38 3.38 0 0 1-4.706 3.102 3.397 3.397 0 0 1-1.649-1.516 3.354 3.354 0 0 1-.397-1.586 3.38 3.38 0 0 1 3.376-3.376ZM5.074 7.151a3.38 3.38 0 0 1 3.376 3.376c0 .573-.144 1.113-.397 1.586a3.396 3.396 0 0 1-1.649 1.516 3.38 3.38 0 0 1-4.706-3.102 3.38 3.38 0 0 1 3.376-3.376Z"
        fill="#D9D0EB"
      />
    </svg>
  )
}
