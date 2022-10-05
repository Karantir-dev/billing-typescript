import * as React from 'react'

const SvgComponent = props => (
  <svg width={40} height={40} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M32.468 4.378C29.812 2.08 26.5 1.152 23.077.742 13.959-2.166 5.827 3.85 2.275 12.188-1.552 21.177.27 31.21 8.57 36.816c8.473 5.722 20.118 3.37 26.618-4.163 7.103-8.233 5.35-21.292-2.72-28.275ZM16.85 37.041c-4.807-.685-9.47-3.642-11.907-7.86-2.177-3.77-2.159-8.491-1.183-12.61 1.5-6.33 6.04-12.045 11.975-13.412.009 0 .016.003.025.003 2.136.063 4.39.067 6.596.305.208.066.417.13.627.207.348.127.652.11.906.006 2.379.4 4.65 1.163 6.588 2.688 4.287 3.373 6.547 9.455 6.423 14.783-.233 10.042-10.538 17.243-20.05 15.89Z"
      fill="url(#a)"
    />
    <path
      d="M14.49 18.14c1.993 0 1.993-3.09 0-3.09-1.992 0-1.992 3.09 0 3.09Z"
      fill="url(#b)"
    />
    <path
      d="M25.153 18.294c1.992 0 1.992-3.09 0-3.09-1.993 0-1.993 3.09 0 3.09Z"
      fill="url(#c)"
    />
    <path
      d="M25.914 23.538c-3.702 3.679-8.478 3.312-12.186-.155-1.453-1.36-3.643.822-2.185 2.186 4.933 4.613 11.647 5.032 16.556.154 1.416-1.406-.77-3.59-2.185-2.185Z"
      fill="url(#b)"
    />
    <defs>
      <linearGradient
        id="a"
        x1={39.639}
        y1={0.001}
        x2={0.361}
        y2={0.001}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF42A8" />
        <stop offset={1} stopColor="#E030BD" />
      </linearGradient>
      <linearGradient
        id="b"
        x1={15.985}
        y1={15.05}
        x2={12.996}
        y2={15.05}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF42A8" />
        <stop offset={1} stopColor="#E030BD" />
      </linearGradient>
      <linearGradient
        id="c"
        x1={26.647}
        y1={15.204}
        x2={23.658}
        y2={15.204}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF42A8" />
        <stop offset={1} stopColor="#E030BD" />
      </linearGradient>
      <linearGradient
        id="d"
        x1={28.558}
        y1={22.954}
        x2={11.063}
        y2={22.954}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF42A8" />
        <stop offset={1} stopColor="#E030BD" />
      </linearGradient>
    </defs>
  </svg>
)

export default SvgComponent
