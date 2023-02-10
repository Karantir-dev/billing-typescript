import React from 'react'
import { useMediaQuery } from 'react-responsive'

function Icon(props) {
  const widerThanMobile = useMediaQuery({ query: '(min-width: 1024px)' })
  if (widerThanMobile) {
    return (
      <svg
        width={196}
        height={139}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <g filter="url(#valentBig)">
          <path
            d="M10 32C10 19.297 20.297 9 33 9h130c12.703 0 23 10.297 23 23v54c0 12.703-10.297 23-23 23H51l-19 19 2.5-19H33c-12.703 0-23-10.297-23-23V32Z"
            fill="#fff"
          />
        </g>
        <defs>
          <filter
            id="valentBig"
            x={0}
            y={0}
            width={196}
            height={139}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy={1} />
            <feGaussianBlur stdDeviation={5} />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix values="0 0 0 0 0.254902 0 0 0 0 0.14902 0 0 0 0 0.447059 0 0 0 0.25 0" />
            <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_4717_22204" />
            <feBlend
              in="SourceGraphic"
              in2="effect1_dropShadow_4717_22204"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    )
  }
  return (
    <svg
      width={234}
      height={111}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter="url(#valentSmall)">
        <path
          d="M10 32C10 19.297 20.297 9 33 9h168c12.703 0 23 10.297 23 23v29.5c0 12.703-10.297 23-23 23H51l-24 15 4.5-15C19.626 84.5 10 74.874 10 63V32Z"
          fill="#fff"
        />
      </g>
      <defs>
        <filter
          id="valentSmall"
          x={0}
          y={0}
          width={234}
          height={110.5}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy={1} />
          <feGaussianBlur stdDeviation={5} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 0.254902 0 0 0 0 0.14902 0 0 0 0 0.447059 0 0 0 0.25 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_4717_22273" />
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_4717_22273"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  )
}

export default Icon
