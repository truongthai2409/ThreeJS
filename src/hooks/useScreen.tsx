import { useEffect, useState } from "react"

// import React from 'react'
type ScreenProps = 'mobile' | 'tablet' | 'desktop'

function checkScreen(width: number): ScreenProps {
    if (width < 768) {
        return 'mobile'
    } else if (width < 1024) {
        return 'tablet'
    } else {
        return 'desktop'
    }
}
export const useScreen = () => {
    const [screen, setScreen] = useState<ScreenProps>(checkScreen(window.innerWidth))

    useEffect(() => {
        const handleResize = () => {
            setScreen(checkScreen(window.innerWidth))
        }
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return screen
}