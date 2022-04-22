import { useEffect } from 'react'

export default function useOutsideAlerter(ref, condition = true, func) {
  useEffect(() => {
    console.log(ref.current, condition)

    condition && document.addEventListener('click', handleClickOutside)

    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target) && condition) {
        if (func) {
          func()
        }
      }
      // event.stopPropagation()
    }
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [ref, condition])
}
