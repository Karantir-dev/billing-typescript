import * as React from 'react'

export default function SvgComponent(props) {
  return (
    <svg
      width={24}
      height={14}
      viewBox="0 0 24 14"
      fill="#AE9CCD"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M19.5 2c.603 0 1.206.131 1.791.39a.498.498 0 0 0 .702-.48A1.994 1.994 0 0 0 20 0H2C.897 0 0 .897 0 2v5c0 1.103.897 2 2 2h11.5a.5.5 0 0 0 .5-.5V8c0-.64.316-1.247.844-1.625a.5.5 0 0 0 .207-.353A4.48 4.48 0 0 1 19.5 2ZM4.616 4.567a.5.5 0 1 1-.5.866L4 5.366V5.5a.5.5 0 1 1-1 0v-.134l-.116.067A.497.497 0 0 1 2.2 5.25a.5.5 0 0 1 .183-.683L2.5 4.5l-.116-.067a.5.5 0 1 1 .5-.866L3 3.634V3.5a.5.5 0 1 1 1 0v.134l.116-.067a.5.5 0 0 1 .5.866L4.5 4.5l.116.067Zm4 0a.5.5 0 1 1-.5.866L8 5.366V5.5a.5.5 0 1 1-1 0v-.134l-.116.067A.497.497 0 0 1 6.2 5.25a.5.5 0 0 1 .183-.683L6.5 4.5l-.116-.067a.5.5 0 1 1 .5-.866L7 3.634V3.5a.5.5 0 1 1 1 0v.134l.116-.067a.5.5 0 0 1 .5.866L8.5 4.5l.116.067Zm4 0a.5.5 0 1 1-.5.866L12 5.366V5.5a.5.5 0 1 1-1 0v-.134l-.116.067a.497.497 0 0 1-.683-.183.5.5 0 0 1 .183-.683L10.5 4.5l-.116-.067a.5.5 0 1 1 .5-.866l.116.067V3.5a.5.5 0 1 1 1 0v.134l.116-.067a.5.5 0 0 1 .5.866L12.5 4.5l.116.067Z" />
      <path d="M23 7v-.5C23 4.57 21.43 3 19.5 3S16 4.57 16 6.5V7c-.551 0-1 .449-1 1v5c0 .551.449 1 1 1h7c.551 0 1-.449 1-1V8c0-.551-.449-1-1-1Zm-3 3.846v.654a.5.5 0 1 1-1 0v-.654a.987.987 0 0 1-.5-.846c0-.551.449-1 1-1 .551 0 1 .449 1 1a.987.987 0 0 1-.5.846ZM21 7h-3v-.5c0-.827.673-1.5 1.5-1.5s1.5.673 1.5 1.5V7Z" />
    </svg>
  )
}
