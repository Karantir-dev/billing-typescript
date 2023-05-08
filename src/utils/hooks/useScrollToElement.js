import { useEffect, useRef, useState } from 'react'

export default function useScrollToElement ({
  condition,
  behavior = 'smooth',
  block = 'center',
}) {
  const [isScroll, setIsScroll] = useState(false)
  const elem = useRef()

  useEffect(() => {
    if (condition && isScroll) {
      scrollTo()
      setIsScroll(false)
    }
  }, [condition])

  const scrollTo = () => elem.current.scrollIntoView({ behavior, block })
  const runScroll = () => setIsScroll(true)

  return [elem, runScroll]
}
