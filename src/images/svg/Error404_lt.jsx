export default function SvgComponent(props) {
  const { svgwidth, svgheight } = props

  return (
    <svg
      width={svgwidth}
      height={svgheight}
      viewBox="0 0 306 212"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g>
        <circle
          cx={152}
          cy={103}
          r={102}
          fill="#F7F4FB"
          filter="drop-shadow(2px 3px 4px rgba(78, 37, 119, 0.13))"
        />
      </g>
      <path
        d="M81 96.918c0-5.523 4.477-10 10-10h22v40H91c-5.523 0-10-4.477-10-10v-20Z"
        fill="#D9D0EB"
      />
      <path d="M81 117.918v-16.5l14 25.5-6.5-.5c-6-.8-7.5-6-7.5-8.5Z" fill="#C8C0D8" />
      <path
        d="M113 120.418c-23.6-4.4-25.5-24.333-23-33.5-3 .333-8.6 2.6-9 9v5.5c1.833 7.833 7.5 20 14 25.5h18v-6.5Z"
        fill="#D1C9E1"
      />
      <path d="M67 101.918a5 5 0 0 1 5-5h9v20h-9a5 5 0 0 1-5-5v-10Z" fill="#A298B7" />
      <path
        d="M81 116.918c-5.6-.4-11.667-10.833-14-16v11.5c0 1.5 1 4.5 5 4.5h9Z"
        fill="#857B99"
      />
      <rect
        x={112.75}
        y={84.668}
        width={4.5}
        height={44.5}
        rx={1.25}
        fill="#D1C9E1"
        stroke="#C8C0D8"
        strokeWidth={1.5}
      />
      <path
        d="M21 110.5h46V105H21c-9.795 1.351-15.027 6.581-17.699 11.99C1 121.65 1 127.022 1 132.222V192c2 2.5 4.5 1.167 5.5 0v-61.783c0-3.803.076-7.747 1.873-11.098 3.323-6.2 9.42-8.352 12.627-8.619ZM285 104.918h-46v5.5h46c9.795-1.351 15.027-6.581 17.699-11.99 2.302-4.66 2.301-10.032 2.301-15.232V23.418c-2-2.5-4.5-1.167-5.5 0V85.2c0 3.803-.076 7.747-1.873 11.098-3.323 6.2-9.421 8.352-12.627 8.619Z"
        fill="#D9D0EB"
        stroke="#C8C0D8"
        strokeWidth={1.5}
      />
      <path
        d="M225 116.918c0 5.523-4.477 10-10 10h-22v-40h22c5.523 0 10 4.477 10 10v20Z"
        fill="#D9D0EB"
      />
      <path d="M225 95.918v16.5l-14-25.5 6.5.5c6 .8 7.5 6 7.5 8.5Z" fill="#C8C0D8" />
      <path
        d="M193 93.418c23.6 4.4 25.5 24.333 23 33.5 3-.333 8.6-2.6 9-9v-5.5c-1.833-7.833-7.5-20-14-25.5h-18v6.5Z"
        fill="#D1C9E1"
      />
      <path d="M239 111.918a5 5 0 0 1-5 5h-9v-20h9a5 5 0 0 1 5 5v10Z" fill="#A298B7" />
      <path
        d="M225 96.918c5.6.4 11.667 10.833 14 16v-11.5c0-1.5-1-4.5-5-4.5h-9Z"
        fill="#857B99"
      />
      <rect
        x={193.25}
        y={129.168}
        width={4.5}
        height={44.5}
        rx={1.25}
        transform="rotate(-180 193.25 129.168)"
        fill="#D1C9E1"
        stroke="#C8C0D8"
        strokeWidth={1.5}
      />
      <path
        d="M171 100.168a2.25 2.25 0 1 1 0-4.5h16.25v4.5H171ZM171 119.168a2.25 2.25 0 1 1 0-4.5h16.25v4.5H171Z"
        fill="#857B99"
        stroke="#675E79"
        strokeWidth={1.5}
      />
      <defs>
        <filter
          id="a"
          x={48}
          y={0}
          width={212}
          height={212}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx={2} dy={3} />
          <feGaussianBlur stdDeviation={2} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 0.305882 0 0 0 0 0.145098 0 0 0 0 0.466667 0 0 0 0.15 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_3089_20926" />
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_3089_20926"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  )
}
