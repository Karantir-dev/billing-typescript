import * as React from 'react'

export default function SvgComponent(props) {
  const { svgwidth, svgheight } = props

  return (
    <svg
      width={svgwidth}
      height={svgheight}
      viewBox="0 0 274 112"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter="url(#a)">
        <path
          d="M70.9 103H49.6V82.3H1.75V65.5L41.5 2.95h29.4v60.6h12.9V82.3H70.9V103ZM49.6 63.55v-41.7l-27 41.7h27Zm107.652 33.6c-6.4 5.1-14.15 7.65-23.25 7.65s-16.9-2.55-23.4-7.65c-6.4-5.2-11-11.6-13.8-19.2-2.8-7.6-4.2-15.9-4.2-24.9 0-9 1.4-17.3 4.2-24.9 2.8-7.6 7.4-13.95 13.8-19.05 6.5-5.1 14.3-7.65 23.4-7.65 9.1 0 16.85 2.55 23.25 7.65 6.4 5.1 11 11.45 13.8 19.05 2.9 7.6 4.35 15.9 4.35 24.9 0 9-1.45 17.3-4.35 24.9-2.8 7.6-7.4 14-13.8 19.2Zm-38.25-20.25c3.2 6 8.2 9 15 9 6.8 0 11.75-3 14.85-9 3.2-6 4.8-13.95 4.8-23.85 0-9.9-1.6-17.8-4.8-23.7-3.1-6-8.05-9-14.85-9-6.8 0-11.8 3-15 9-3.2 5.9-4.8 13.8-4.8 23.7 0 9.9 1.6 17.85 4.8 23.85ZM253.42 103h-21.3V82.3h-47.85V65.5l39.75-62.55h29.4v60.6h12.9V82.3h-12.9V103Zm-21.3-39.45v-41.7l-27 41.7h27Z"
          fill="#EDE7F8"
        />
      </g>
      <defs>
        <filter
          id="a"
          x={0.75}
          y={0.45}
          width={272.57}
          height={111.35}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx={3} dy={3} />
          <feGaussianBlur stdDeviation={2} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 0.30625 0 0 0 0 0.145833 0 0 0 0 0.466667 0 0 0 0.29 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_3083_21086" />
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_3083_21086"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  )
}
