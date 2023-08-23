import { useEffect, useRef, useState } from 'react'

export default function useCancelRequest() {
  const abortCont = useRef(new AbortController())
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    return () => {
      abortCont.current.abort()
    }
  }, [])

  return { signal: abortCont.current.signal, isLoading, setIsLoading }
}
