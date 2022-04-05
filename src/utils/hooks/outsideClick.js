import { useEffect } from 'react'

export default function useOutsideAlerter(ref, condition = true, func) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target) && condition) {
        if (func) {
          func()
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, condition])
}
