import * as React from 'react'

export default function SvgComponent(props) {
  const { className } = props
  return (
    <svg width={18} height={9} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="m17.045 1.577.129-.123c.252-.252.31-.75.137-1.111-.176-.366-.522-.448-.768-.2C7.918 8.87 1.64.574 1.376.217 1.154-.085.803-.07.596.25c-.208.322-.198.825.022 1.127.012.017.208.277.567.662L.08 4.675c-.158.376-.075.867.185 1.097a.44.44 0 0 0 .288.117c.185 0 .366-.137.471-.383l1.08-2.576A12.165 12.165 0 0 0 4.412 4.54L3.88 7.114c-.089.424.076.867.368.993l.158.034c.236 0 .456-.224.527-.57l.528-2.54c.854.337 1.81.566 2.84.62v2.551c0 .441.247.798.552.798.305 0 .551-.357.551-.798V5.637a9.41 9.41 0 0 0 2.85-.707l.678 2.59c.084.32.294.515.515.515l.196-.05c.284-.157.428-.618.32-1.03l-.66-2.523a15.037 15.037 0 0 0 2.811-1.98l.893 1.726c.11.208.275.32.441.32.116 0 .231-.05.33-.16.245-.265.294-.765.112-1.117l-.845-1.644Z"
        fill="#777"
        className={className}
      />
    </svg>
  )
}
