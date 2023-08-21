import { useEffect, useRef } from 'react'

export default function useCancelRequest() {
  const abortCont = useRef(new AbortController())

  useEffect(() => {
    return () => {
      abortCont.current.abort()
    }
  }, [])

  return abortCont.current.signal
}
