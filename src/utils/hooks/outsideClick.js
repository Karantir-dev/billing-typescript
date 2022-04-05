import { useEffect } from 'react'

export default function useOutsideAlerter(ref, condition = true, func) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target) && condition) {
        if (func) {
          func()
        }
      }
      event.stopPropagation();
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [ref, condition])
}
