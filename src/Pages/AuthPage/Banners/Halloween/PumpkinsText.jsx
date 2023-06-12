import { useMediaQuery } from 'react-responsive'

function Icon(props) {
  const widerThanMobile = useMediaQuery({ query: '(min-width: 1024px)' })
  if (!widerThanMobile) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="227"
        height="122"
        fill="none"
        viewBox="0 0 227 122"
        {...props}
      >
        <g filter="url(#filter0_d_2421_3426)">
          <path
            fill="#fff"
            d="M37.643 89.41L33.375 111l23.166-19.839 119.468 1.752c8.099-.712 14.437-1.65 19.436-2.733C213.034 86.366 218 65.334 218 47.336v-1.504c0-10.838-1.842-22.331-9.661-29.837-6.067-5.824-12.572-7.809-20.004-7.683H52.745C28.452 6.69 17.968 11.644 13.372 17.36c-5.32 6.613-3.127 16.225-3.451 24.706-.416 10.858-1.655 24.461-.314 33.342 1.958 12.976 13.084 13.415 27.72 13.991l.316.013z"
          ></path>
          <path
            stroke="#321454"
            d="M37.643 89.41L33.375 111l23.166-19.839 119.468 1.752c8.099-.712 14.437-1.65 19.436-2.733C213.034 86.366 218 65.334 218 47.336v-1.504c0-10.838-1.842-22.331-9.661-29.837-6.067-5.824-12.572-7.809-20.004-7.683H52.745C28.452 6.69 17.968 11.644 13.372 17.36c-5.32 6.613-3.127 16.225-3.451 24.706-.416 10.858-1.655 24.461-.314 33.342 1.958 12.976 13.084 13.415 27.72 13.991l.316.013z"
          ></path>
        </g>
        <defs>
          <filter
            id="filter0_d_2421_3426"
            width="226"
            height="120.817"
            x="0.5"
            y="0.5"
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            ></feColorMatrix>
            <feOffset dy="1"></feOffset>
            <feGaussianBlur stdDeviation="4"></feGaussianBlur>
            <feComposite in2="hardAlpha" operator="out"></feComposite>
            <feColorMatrix values="0 0 0 0 0.254902 0 0 0 0 0.14902 0 0 0 0 0.447059 0 0 0 0.15 0"></feColorMatrix>
            <feBlend
              in2="BackgroundImageFix"
              result="effect1_dropShadow_2421_3426"
            ></feBlend>
            <feBlend
              in="SourceGraphic"
              in2="effect1_dropShadow_2421_3426"
              result="shape"
            ></feBlend>
          </filter>
        </defs>
      </svg>
    )
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="211"
      height="144"
      fill="none"
      viewBox="0 0 211 144"
      {...props}
    >
      <g filter="url(#filter0_d_2397_19792)">
        <path
          fill="#fff"
          d="M35.518 106.721L31.568 133l21.447-24.148 110.608 2.132c11.006-1.272 18.499-3.135 23.716-5.286 13.686-5.641 15.161-24.014 15.161-38.816V46.474c0-8.517-1.288-17.184-5.723-24.455-6.537-10.718-13.529-14.195-21.742-14.012H49.501C21.744 5.57 13.46 15.325 10.861 23.965c-1.864 6.198-.855 12.847-.897 19.318-.09 13.815-1.833 33.926-.402 46.392 1.813 15.796 12.114 16.329 25.665 17.031l.291.015z"
        ></path>
        <path
          stroke="#321454"
          d="M35.518 106.721L31.568 133l21.447-24.148 110.608 2.132c11.006-1.272 18.499-3.135 23.716-5.286 13.686-5.641 15.161-24.014 15.161-38.816V46.474c0-8.517-1.288-17.184-5.723-24.455-6.537-10.718-13.529-14.195-21.742-14.012H49.501C21.744 5.57 13.46 15.325 10.861 23.965c-1.864 6.198-.855 12.847-.897 19.318-.09 13.815-1.833 33.926-.402 46.392 1.813 15.796 12.114 16.329 25.665 17.031l.291.015z"
        ></path>
      </g>
      <defs>
        <filter
          id="filter0_d_2397_19792"
          width="210.5"
          height="143.465"
          x="0.5"
          y="0.127"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          ></feColorMatrix>
          <feOffset dy="1"></feOffset>
          <feGaussianBlur stdDeviation="4"></feGaussianBlur>
          <feComposite in2="hardAlpha" operator="out"></feComposite>
          <feColorMatrix values="0 0 0 0 0.254902 0 0 0 0 0.14902 0 0 0 0 0.447059 0 0 0 0.15 0"></feColorMatrix>
          <feBlend
            in2="BackgroundImageFix"
            result="effect1_dropShadow_2397_19792"
          ></feBlend>
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_2397_19792"
            result="shape"
          ></feBlend>
        </filter>
      </defs>
    </svg>
  )
}

export default Icon
