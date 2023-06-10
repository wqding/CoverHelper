import { createContext, useContext, useState } from 'react'

const PreviewContext = createContext()

export function usePreview() {
    return useContext(PreviewContext)
}

export function PreviewProvider({ children }) {
    const [openPreview, setOpenPreview] = useState(false)
    const [canPreview, setCanPreview] = useState(false)

    return (
        <PreviewContext.Provider value={{openPreview, setOpenPreview, canPreview, setCanPreview}}>
          {children}
        </PreviewContext.Provider>
      )
}
    