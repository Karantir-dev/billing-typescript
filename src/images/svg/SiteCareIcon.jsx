import * as React from 'react'

const SvgComponent = props => (
  <svg width={24} height={57} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M0 16v20.514c0 .444.28.889.84 1.167l17.174 9.84c1.23.722 3.413.611 4.811-.223.783-.444 1.175-1.056 1.175-1.612V25.173L0 16Z"
      fill="url(#a)"
    />
    <path
      opacity={0.3}
      d="M20.047 47.945c.988.17 2.118-.057 2.965-.622.659-.453.988-1.075.988-1.64V24.81L20.094 23H20v24.945h.047Z"
      fill="#380B45"
    />
    <path
      d="M18.02 26.49.828 16.508c-1.232-.733-1.064-1.973.336-2.82 1.456-.845 3.584-.902 4.816-.225l17.192 10.038c1.232.733 1.064 1.973-.336 2.82-1.456.845-3.584.901-4.816.168Z"
      fill="url(#b)"
    />
    <path
      opacity={0.5}
      d="M18.02 56.513.828 46.514c-1.232-.734-1.064-1.977.336-2.824 1.456-.847 3.584-.904 4.816-.226l17.192 9.999c1.232.734 1.064 1.977-.336 2.824-1.456.847-3.584.96-4.816.226Z"
      fill="#24126A"
      fillOpacity={0.2}
    />
    <path
      d="M19.617 26c-.823 0-1.48-.694-1.48-1.561v-9.485c0-3.238-2.25-7.344-4.882-8.964L9.416 3.62c-1.042-.637-1.919-.753-2.522-.406-.604.347-.933 1.273-.933 2.487v9.485c0 .867-.658 1.56-1.48 1.56-.823 0-1.481-.693-1.481-1.56V5.758C3 3.33 3.823 1.537 5.358.612c1.536-.925 3.455-.81 5.43.405l3.838 2.37c3.565 2.198 6.362 7.288 6.362 11.625v9.484c.11.81-.548 1.504-1.371 1.504Z"
      fill="url(#c)"
    />
    <defs>
      <linearGradient
        id="a"
        x1={-0.118}
        y1={27.607}
        x2={23.801}
        y2={38.267}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#E287F7" />
        <stop offset={1} stopColor="#A639FB" />
      </linearGradient>
      <linearGradient
        id="b"
        x1={-0.13}
        y1={15.018}
        x2={21.874}
        y2={26.627}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#E8C2FF" />
        <stop offset={1} stopColor="#B271EC" />
      </linearGradient>
      <linearGradient
        id="c"
        x1={1.876}
        y1={10.255}
        x2={22.363}
        y2={18.998}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#D389FF" />
        <stop offset={0.873} stopColor="#9654ED" />
      </linearGradient>
    </defs>
  </svg>
)

export default SvgComponent
