import * as React from 'react'

export default function SvgComponent(props) {
  const { className } = props
  return (
    <svg
      className={className}
      width={19}
      height={19}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#a)" fill="#C4C4C4">
        <path d="M14.844 19H4.156a1.783 1.783 0 0 1-1.781-1.781V8.906c0-.982.8-1.781 1.781-1.781h10.688c.981 0 1.781.799 1.781 1.781v8.313c0 .982-.8 1.781-1.781 1.781ZM4.156 8.312a.594.594 0 0 0-.593.594v8.313c0 .328.266.593.593.593h10.688a.594.594 0 0 0 .594-.593V8.906a.594.594 0 0 0-.594-.594H4.156Z" />
        <path d="M13.656 8.313a.594.594 0 0 1-.594-.594V4.75A3.567 3.567 0 0 0 9.5 1.187 3.567 3.567 0 0 0 5.937 4.75v2.969a.594.594 0 0 1-1.187 0V4.75C4.75 2.13 6.88 0 9.5 0s4.75 2.13 4.75 4.75v2.969a.594.594 0 0 1-.594.593ZM9.5 13.458c-.873 0-1.583-.71-1.583-1.583s.71-1.584 1.583-1.584 1.584.71 1.584 1.584c0 .873-.71 1.583-1.584 1.583Zm0-1.979a.396.396 0 1 0 .002.793.396.396 0 0 0-.002-.793Z" />
        <path d="M9.5 15.833a.594.594 0 0 1-.594-.593v-2.178a.594.594 0 0 1 1.188 0v2.178a.594.594 0 0 1-.594.593Z" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h19v19H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}
