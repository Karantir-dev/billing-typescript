import { useFormikContext } from 'formik'
import { useEffect } from 'react'

export default function ScrollToFieldError({
  scrollBehavior = { behavior: 'smooth', block: 'center' },
}) {
  const { submitCount, isValid, errors } = useFormikContext()

  const getFieldErrorNames = formikErrors => {
    const transformObjectToDotNotation = (obj, prefix = '', result = []) => {
      Object.keys(obj).forEach(key => {
        const value = obj[key]
        if (!value) return

        const nextKey = prefix ? `${prefix}.${key}` : key
        if (typeof value === 'object') {
          transformObjectToDotNotation(value, nextKey, result)
        } else {
          result.push(nextKey)
        }
      })

      return result
    }

    return transformObjectToDotNotation(formikErrors)
  }

  useEffect(() => {
    if (isValid) return

    const fieldErrorNames = getFieldErrorNames(errors)
    if (fieldErrorNames.length <= 0) return

    const element =
      document.querySelector(`input[name='${fieldErrorNames[0]}']`) ||
      document.querySelector(`button[name='${fieldErrorNames[0]}']`)
    if (!element) return

    // Scroll to first known error into view
    element.scrollIntoView(scrollBehavior)

    // Formik doesn't (yet) provide a callback for a client-failed submission,
    // thus why this is implemented through a hook that listens to changes on
    // the submit count.
  }, [submitCount])

  return null
}
