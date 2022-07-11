import * as React from 'react'
import Gradient from './Gradient'

export default function SvgComponent(props) {
  const { className } = props
  return (
    <svg width={28} height={29} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g className={className} fill="#D9D0EB">
        <path d="M27.641 19.662a8.953 8.953 0 0 0-4.915-7.973c-.091 6.57-5.423 11.898-12 11.989a8.963 8.963 0 0 0 7.98 4.91 8.91 8.91 0 0 0 4.547-1.24l4.35 1.201-1.204-4.345a8.889 8.889 0 0 0 1.242-4.542Z" />
        <path d="M21.109 11.517c0-5.815-4.735-10.545-10.555-10.545C4.734.972 0 5.702 0 11.517c0 1.895.505 3.74 1.464 5.36L.039 22.023l5.15-1.424a10.528 10.528 0 0 0 5.365 1.463c5.82 0 10.555-4.73 10.555-10.545ZM8.935 9.062h-1.62a3.241 3.241 0 0 1 3.24-3.236 3.241 3.241 0 0 1 3.239 3.236c0 .906-.384 1.777-1.054 2.389l-1.376 1.258v1.262h-1.62v-1.975l1.903-1.74a1.6 1.6 0 0 0 .527-1.194 1.62 1.62 0 0 0-3.24 0Zm.81 6.527h1.62v1.618h-1.62V15.59Z" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" transform="translate(0 .972)" d="M0 0h27.641v27.616H0z" />
        </clipPath>
      </defs>
      <Gradient />
    </svg>
  )
}