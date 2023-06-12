export default function SvgComponent(props) {
  return (
    <svg
      width={10}
      height={11}
      viewBox="0 0 10 11"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M10 5.5a.499.499 0 0 1-.146.354l-5 5a.5.5 0 1 1-.707-.707L8.793 5.5 4.147.854a.5.5 0 1 1 .707-.707l5 5A.499.499 0 0 1 10 5.5Zm-4.146-.354-5-5a.5.5 0 1 0-.707.708L4.793 5.5.147 10.146a.5.5 0 1 0 .707.707l5-5a.499.499 0 0 0 0-.707Z" />
    </svg>
  )
}
