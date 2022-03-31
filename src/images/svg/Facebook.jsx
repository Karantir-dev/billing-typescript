import * as React from 'react'

export default function SvgComponent(props) {
  const { className } = props
  return (
    <svg
      className={className}
      width={32}
      height={32}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M16 32c8.837 0 16-7.163 16-16S24.837 0 16 0 0 7.163 0 16s7.163 16 16 16Z"
        fill="#3B5998"
      />
      <path
        d="M20.023 16.626h-2.855v10.46h-4.326v-10.46h-2.057V12.95h2.057v-2.378c0-1.701.808-4.365 4.364-4.365l3.205.013v3.568h-2.325c-.381 0-.918.191-.918 1.002v2.164h3.233l-.378 3.672Z"
        fill="#fff"
      />
    </svg>
  )
}
