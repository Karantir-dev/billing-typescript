import { useEffect } from 'react'

const PageTitleRender = ({ title, children }) => {
  useEffect(() => {
    document.title = `Zomro dashboard: ${title}` || 'Zomro dashboard'

    return () => (document.title = 'Zomro dashboard')
  }, [title])
  return children
}

export default PageTitleRender
