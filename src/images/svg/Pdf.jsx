export default function SvgComponent(props) {
  return (
    <svg width={30} height={22} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect
        x={0.75}
        y={0.75}
        width={28.5}
        height={20.5}
        rx={2.25}
        stroke="url(#a)"
        strokeWidth={1.5}
      />
      <path
        d="M7.288 15H5.726V7.663h3.432c.77 0 1.371.227 1.804.682.44.447.66 1.008.66 1.683 0 .667-.22 1.228-.66 1.683-.44.455-1.041.682-1.804.682h-1.87V15Zm1.661-3.982c.315 0 .572-.088.77-.264a.926.926 0 0 0 .308-.726c0-.3-.103-.539-.308-.715-.198-.183-.455-.275-.77-.275H7.288v1.98h1.661ZM15.483 15H12.59V7.663h2.893c1.152 0 2.087.337 2.805 1.012.726.675 1.09 1.562 1.09 2.662 0 1.1-.36 1.987-1.079 2.662-.718.667-1.657 1.001-2.816 1.001Zm0-1.375c.704 0 1.262-.22 1.672-.66.418-.44.627-.983.627-1.628 0-.675-.201-1.225-.605-1.65-.403-.433-.968-.649-1.694-.649h-1.33v4.587h1.33ZM22.048 15h-1.562V7.663h5.192v1.375h-3.63v1.551H25.6v1.375h-3.553V15Z"
        fill="url(#b)"
      />
      <defs>
        <linearGradient
          id="a"
          x1={30}
          y1={0.001}
          x2={0}
          y2={0.001}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF42A8" />
          <stop offset={1} stopColor="#E030BD" />
        </linearGradient>
        <linearGradient
          id="b"
          x1={27}
          y1={5}
          x2={5}
          y2={5}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF42A8" />
          <stop offset={1} stopColor="#E030BD" />
        </linearGradient>
      </defs>
    </svg>
  )
}
