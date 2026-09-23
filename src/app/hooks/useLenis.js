"use client"
import React, { useEffect } from 'react';
import Lenis from 'lenis';

const useLenis = () => {
    const lenisRef = useRef(null);

    useEffect(() => {
        const lenis = new Lenis()
    })
    return (
        <div>useLenis</div>
    )
}

export default useLenis