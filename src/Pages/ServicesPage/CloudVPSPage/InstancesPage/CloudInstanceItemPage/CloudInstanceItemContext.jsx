import { useContext, createContext } from 'react'

const CloudInstanceItemContext = createContext({})

export const CloudInstanceItemProvider = ({ children, value }) => {
  return (
    <CloudInstanceItemContext.Provider value={value}>
      {children}
    </CloudInstanceItemContext.Provider>
  )
}

export const useCloudInstanceItemContext = () => useContext(CloudInstanceItemContext)
