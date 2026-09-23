import React from 'react'


const Container = ({ children, className = '' }) => {
    return (
        <div className={`w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-10 lg:pb-14 ${className}`} >
            {children}
        </div>
    )
}

export default Container