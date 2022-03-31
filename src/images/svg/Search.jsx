import * as React from 'react'

export default function SvgComponent(props) {
  const { className } = props
  return (
    <svg
      className={className}
      width={15}
      height={15}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6.037 12.07c1.34 0 2.643-.448 3.7-1.272l3.991 3.991a.75.75 0 0 0 1.061-1.06L10.8 9.736a6.035 6.035 0 0 0-9.53-7.404 6.035 6.035 0 0 0 4.768 9.737ZM2.831 2.829a4.534 4.534 0 1 1 6.413 6.413 4.534 4.534 0 0 1-6.413 0 4.52 4.52 0 0 1 0-6.413Z"
        fill="#CCCBCF"
      />
    </svg>
  )
}
