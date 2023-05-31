export default function SvgComponent(props) {
  const { svgwidth, svgheight } = props

  return (
    <svg
      width={svgwidth}
      height={svgheight}
      viewBox="0 0 306 204"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        cx={152}
        cy={102}
        r={102}
        fill="#36313F"
        filter="drop-shadow(3px 3px 4px rgba(0, 0, 0, 0.3))"
      />
      <path
        d="M21 109.5h46V104H21c-9.795 1.351-15.027 6.581-17.699 11.99C1 120.65 1 126.022 1 131.222V191c2 2.5 4.5 1.167 5.5 0v-61.783c0-3.803.076-7.747 1.873-11.098 3.323-6.2 9.42-8.352 12.627-8.619Z"
        fill="#BBAFD3"
        stroke="#968AB4"
        strokeWidth={1.5}
      />
      <path
        d="M81 95.918c0-5.523 4.477-10 10-10h22v40H91c-5.523 0-10-4.477-10-10v-20Z"
        fill="#EAE4F5"
      />
      <path d="M81 116.918v-16.5l14 25.5-6.5-.5c-6-.8-7.5-6-7.5-8.5Z" fill="#C8BFDC" />
      <path
        d="M113 119.418c-23.6-4.4-25.5-24.333-23-33.5-3 .333-8.6 2.6-9 9v5.5c1.833 7.833 7.5 20 14 25.5h18v-6.5Z"
        fill="#DED5EE"
      />
      <path d="M67 100.918a5 5 0 0 1 5-5h9v20h-9a5 5 0 0 1-5-5v-10Z" fill="#BBAFD3" />
      <path
        d="M81 115.918c-5.6-.4-11.667-10.833-14-16v11.5c0 1.5 1 4.5 5 4.5h9Z"
        fill="#968AB4"
      />
      <rect
        x={112.75}
        y={83.668}
        width={4.5}
        height={44.5}
        rx={1.25}
        fill="#DED5EE"
        stroke="#C8BFDC"
        strokeWidth={1.5}
      />
      <path
        d="M285 103.918h-46v5.5h46c9.795-1.351 15.027-6.581 17.699-11.99 2.302-4.66 2.301-10.032 2.301-15.232V22.418c-2-2.5-4.5-1.167-5.5 0V84.2c0 3.803-.076 7.747-1.873 11.098-3.323 6.2-9.421 8.352-12.627 8.619Z"
        fill="#BBAFD3"
        stroke="#968AB4"
        strokeWidth={1.5}
      />
      <path
        d="M225 115.918c0 5.523-4.477 10-10 10h-22v-40h22c5.523 0 10 4.477 10 10v20Z"
        fill="#EAE4F5"
      />
      <path d="M225 94.918v16.5l-14-25.5 6.5.5c6 .8 7.5 6 7.5 8.5Z" fill="#C8BFDC" />
      <path
        d="M193 92.418c23.6 4.4 25.5 24.333 23 33.5 3-.333 8.6-2.6 9-9v-5.5c-1.833-7.833-7.5-20-14-25.5h-18v6.5Z"
        fill="#DED5EE"
      />
      <path d="M239 110.918a5 5 0 0 1-5 5h-9v-20h9a5 5 0 0 1 5 5v10Z" fill="#BBAFD3" />
      <path
        d="M225 95.918c5.6.4 11.667 10.833 14 16v-11.5c0-1.5-1-4.5-5-4.5h-9Z"
        fill="#968AB4"
      />
      <rect
        x={193.25}
        y={128.168}
        width={4.5}
        height={44.5}
        rx={1.25}
        transform="rotate(-180 193.25 128.168)"
        fill="#DED5EE"
        stroke="#C8BFDC"
        strokeWidth={1.5}
      />
      <path
        d="M171 99.168a2.25 2.25 0 1 1 0-4.5h16.25v4.5H171ZM171 118.168a2.25 2.25 0 1 1 0-4.5h16.25v4.5H171Z"
        fill="#BBAFD3"
        stroke="#968AB4"
        strokeWidth={1.5}
      />
    </svg>
  )
}
