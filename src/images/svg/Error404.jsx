import * as React from 'react'

export default function SvgComponent(props) {
  const { svgwidth, svgheight } = props

  return (
    <svg
      width={svgwidth}
      height={svgheight}
      viewBox="0 0 200 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter="url(#a)">
        <circle cx={105.309} cy={71.46} r={70.46} fill="#36313F" />
      </g>
      <path
        d="M56.263 70.35c0-5.522 4.477-10 10-10h12.105v27.632H66.263c-5.523 0-10-4.477-10-10v-7.631Z"
        fill="#EAE4F5"
      />
      <path
        d="M56.263 81.765V70.367l9.671 17.615-4.49-.345c-4.145-.553-5.18-4.145-5.18-5.872Z"
        fill="#C8C0D8"
      />
      <path
        d="M78.368 83.492c-16.302-3.04-17.615-16.81-15.888-23.141-2.072.23-5.94 1.796-6.217 6.217v3.799c1.267 5.411 5.181 13.816 9.671 17.615h12.434v-4.49Z"
        fill="#D1C9E1"
      />
      <path
        d="M46.592 72.259a5 5 0 0 1 5-5h4.671v13.816h-4.67a5 5 0 0 1-5-5v-3.816Z"
        fill="#A298B7"
      />
      <path
        d="M56.263 81.074c-3.868-.276-8.059-7.483-9.67-11.052v7.944c0 1.036.69 3.108 3.453 3.108h6.217Z"
        fill="#857B99"
      />
      <rect
        x={78.427}
        y={59.028}
        width={2.645}
        height={30.276}
        rx={1.25}
        fill="#D1C9E1"
        stroke="#C8C0D8"
        strokeWidth={1.5}
      />
      <path
        d="M14.816 76.641h31.776v-3.8H14.816c-5.485.757-8.898 3.274-10.978 6.191C.79 83.309 1 88.948 1 94.201v38.74c1.382 1.726 3.109.805 3.8 0V92.029c0-3.802-.046-7.886 2.244-10.922 2.374-3.148 5.836-4.305 7.772-4.466ZM197.184 72.785h-31.776v3.8h31.776c5.485-.757 8.898-3.274 10.978-6.191 3.049-4.277 2.838-9.917 2.838-15.169v-38.74c-1.382-1.727-3.109-.806-3.8 0v40.912c0 3.802.046 7.886-2.244 10.922-2.374 3.148-5.836 4.304-7.772 4.466Z"
        fill="#D9D0EB"
        stroke="#C8C0D8"
        strokeWidth={1.5}
      />
      <path
        d="M155.737 77.982c0 5.523-4.477 10-10 10h-12.105V60.351h12.105c5.523 0 10 4.477 10 10v7.631Z"
        fill="#EAE4F5"
      />
      <path
        d="M155.737 66.568v11.398l-9.671-17.615 4.49.345c4.145.553 5.181 4.145 5.181 5.872Z"
        fill="#C8C0D8"
      />
      <path
        d="M133.632 64.841c16.302 3.04 17.615 16.81 15.888 23.141 2.072-.23 5.941-1.796 6.217-6.217v-3.799c-1.267-5.411-5.181-13.816-9.671-17.615h-12.434v4.49Z"
        fill="#D1C9E1"
      />
      <path
        d="M165.408 76.074a5 5 0 0 1-5 5h-4.671V67.258h4.671a5 5 0 0 1 5 5v3.816Z"
        fill="#A298B7"
      />
      <path
        d="M155.737 67.258c3.868.276 8.059 7.484 9.671 11.053v-7.945c0-1.036-.691-3.108-3.454-3.108h-6.217Z"
        fill="#857B99"
      />
      <rect
        x={133.572}
        y={89.305}
        width={2.645}
        height={30.276}
        rx={1.25}
        transform="rotate(-180 133.572 89.305)"
        fill="#D1C9E1"
        stroke="#C8C0D8"
        strokeWidth={1.5}
      />
      <path
        d="M118.434 66.627h10.994v2.645h-10.994a1.322 1.322 0 0 1 0-2.645ZM118.434 79.752h10.994v2.645h-10.994a1.322 1.322 0 0 1 0-2.645Z"
        fill="#857B99"
        stroke="#675E79"
        strokeWidth={1.5}
      />
      <defs>
        <filter
          id="a"
          x={33.849}
          y={0}
          width={148.921}
          height={148.921}
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
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_3093_21128" />
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_3093_21128"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  )
}
