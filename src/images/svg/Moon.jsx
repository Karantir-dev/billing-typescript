import * as React from 'react'

export default function SvgComponent(props) {
  const { className } = props
  return (
    <svg
      className={className}
      width={20}
      height={22}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.563 21.769c4.042.043 7.734-2.331 9.437-6.068a7.933 7.933 0 0 1-3.4.684c-4.582-.006-8.295-3.79-8.3-8.46.045-3.16 1.755-6.05 4.475-7.565a15.478 15.478 0 0 0-2.212-.127C4.73.233 0 5.053 0 11c0 5.947 4.73 10.768 10.563 10.768Z"
        fill="#fff"
      />
    </svg>
  )
}
