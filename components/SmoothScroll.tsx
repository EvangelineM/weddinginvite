"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export function SmoothScroll() {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        // Initialize Lenis with refined wedding stationery inertia
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 0.9,
            touchMultiplier: 1.5,
            autoRaf: true,
        });

        lenisRef.current = lenis;

        // Attach to global window for external controls (like locking/unlocking)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).__lenis = lenis;

        return () => {
            lenis.destroy();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).__lenis = null;
        };
    }, []);

    return null;
}
