"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { TranslationContent, Language } from "@/lib/translations";

const HEART_FRAME = "/images/savedate/Ornate Rose-Gold Floral Heart Frame.png";
const GOLD_HEART_TEXTURE = "/images/savedate/Golden Foil Heart Cutout.png";
const HEART_FOIL_MASK = "/images/savedate/heart-foil-mask.png";
const SAVE_DATE_BACKGROUND =
    "/images/savedate/Romantic Peach Petal Stationery Background.png";
const HEART_BACKGROUND = "/images/savedate/heart_bg.png";
const ORNAMENTAL_DIVIDER =
    "/images/savedate/Golden Diamond Ornamental Divider.png";
const REVEAL_THRESHOLD = 0.2;
const BRUSH_RADIUS = 34;
const LEAF_COUNT = 15;
const MIN_LEAF_DURATION = 5.5;
const MAX_LEAF_DURATION = 7.6;

// Both heart images are 1536×1024 (aspect 1.5).  The HEART_FRAME overlay
// is displayed via <Image fill className="object-contain">, so the browser
// letterboxes it when the container aspect ratio differs from 1.5.
//
// To keep the foil canvas perfectly aligned with the frame at ANY container
// aspect ratio (desktop 1.5:1, mobile 1:1, etc.) we replicate the
// object-contain math at draw-time and position the foil relative to
// that rectangle — not relative to the raw canvas dimensions.
const IMG_ASPECT = 1536 / 1024;

/**
 * Compute the same rectangle the browser uses for object-fit:contain
 * on a 1536×1024 image inside a container of size w × h.
 */
function containRect(w: number, h: number) {
    const containerAspect = w / h;
    if (containerAspect > IMG_ASPECT) {
        // Container wider than image → fit to height, center horizontally
        const dH = h;
        const dW = dH * IMG_ASPECT;
        return { x: (w - dW) / 2, y: 0, w: dW, h: dH };
    }
    // Container taller than image → fit to width, center vertically
    const dW = w;
    const dH = dW / IMG_ASPECT;
    return { x: 0, y: (h - dH) / 2, w: dW, h: dH };
}

function ScratchHeart({
    t,
    onReveal,
}: {
    t: TranslationContent;
    onReveal: () => void;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isScratchingRef = useRef(false);
    const hasRevealedRef = useRef(false);
    const progressFrameRef = useRef<number | null>(null);
    const totalScratchPixelsRef = useRef(0);
    const [isRevealed, setIsRevealed] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || hasRevealedRef.current) return;

        const drawGoldLayer = () => {
            if (hasRevealedRef.current) return;
            const bounds = canvas.getBoundingClientRect();
            const pixelRatio = window.devicePixelRatio || 1;
            canvas.width = Math.max(1, Math.round(bounds.width * pixelRatio));
            canvas.height = Math.max(1, Math.round(bounds.height * pixelRatio));

            const context = canvas.getContext("2d", {
                willReadFrequently: true,
            });
            if (!context) return;
            context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

            context.globalCompositeOperation = "source-over";
            context.clearRect(0, 0, bounds.width, bounds.height);
            if (
                !goldImage.complete ||
                goldImage.naturalWidth === 0 ||
                !maskImage.complete ||
                maskImage.naturalWidth === 0
            )
                return;

            // Compute the object-contain rectangle so the foil is drawn
            // in the exact same space the browser places the HEART_FRAME.
            const cr = containRect(bounds.width, bounds.height);

            const goldBase = context.createLinearGradient(
                cr.x,
                cr.y,
                cr.x + cr.w,
                cr.y + cr.h,
            );
            goldBase.addColorStop(0, "#c58b42");
            goldBase.addColorStop(0.45, "#9f642f");
            goldBase.addColorStop(1, "#c18a42");
            context.fillStyle = goldBase;
            context.fillRect(cr.x, cr.y, cr.w, cr.h);

            // Draw gold foil to fill the contain rect (same coords as frame)
            context.drawImage(goldImage, cr.x, cr.y, cr.w, cr.h);

            context.fillStyle = "#fff4d4";
            context.textAlign = "center";
            context.textBaseline = "middle";
            const serifFont =
                getComputedStyle(document.documentElement)
                    .getPropertyValue("--font-cormorant")
                    .trim() || "Georgia, serif";
            // Text positioned relative to the contain rect
            const textCx = cr.x + cr.w / 2;
            // Size text from the heart width, then shrink to fit the heart's
            // span at that height so long translations never spill out.
            const fitFont = (
                text: string,
                style: string,
                preferredSize: number,
                maxWidth: number,
            ) => {
                context.font = `${style} ${preferredSize}px ${serifFont}`;
                const width = context.measureText(text).width;
                const size =
                    width > maxWidth
                        ? (preferredSize * maxWidth) / width
                        : preferredSize;
                context.font = `${style} ${size}px ${serifFont}`;
                return size;
            };
            const titleSize = fitFont(
                t.saveTheDate.scratchInstruction,
                "700",
                cr.w * 0.042,
                cr.w * 0.5,
            );
            const titleY = cr.y + cr.h * 0.48;
            context.fillText(t.saveTheDate.scratchInstruction, textCx, titleY);
            const subtitleSize = fitFont(
                t.saveTheDate.scratchSubtitle,
                "italic 600",
                cr.w * 0.03,
                cr.w * 0.42,
            );
            context.fillText(
                t.saveTheDate.scratchSubtitle,
                textCx,
                titleY + titleSize * 0.6 + subtitleSize * 0.9,
            );

            // Clip to the frame's inner opening (same mask as the CSS mask)
            context.globalCompositeOperation = "destination-in";
            context.drawImage(maskImage, cr.x, cr.y, cr.w, cr.h);
            context.globalCompositeOperation = "source-over";

            const pixels = context.getImageData(
                0,
                0,
                canvas.width,
                canvas.height,
            ).data;
            let totalPixels = 0;
            for (let index = 3; index < pixels.length; index += 4) {
                if (pixels[index] > 0) totalPixels += 1;
            }
            totalScratchPixelsRef.current = totalPixels;
        };

        const goldImage = new window.Image();
        goldImage.onload = drawGoldLayer;
        goldImage.src = GOLD_HEART_TEXTURE;
        const maskImage = new window.Image();
        maskImage.onload = drawGoldLayer;
        maskImage.src = HEART_FOIL_MASK;
        drawGoldLayer();
        const resizeObserver = new ResizeObserver(drawGoldLayer);
        resizeObserver.observe(canvas);
        return () => {
            goldImage.onload = null;
            maskImage.onload = null;
            resizeObserver.disconnect();
        };
    }, [t.saveTheDate.scratchInstruction, t.saveTheDate.scratchSubtitle]);

    const revealDate = () => {
        if (hasRevealedRef.current) return;
        hasRevealedRef.current = true;
        setIsRevealed(true);
        onReveal();
    };

    const checkRevealProgress = () => {
        const canvas = canvasRef.current;
        if (!canvas || hasRevealedRef.current) return;

        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) return;
        const pixels = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height,
        ).data;
        let remainingPixels = 0;
        for (let index = 3; index < pixels.length; index += 4) {
            if (pixels[index] > 0) remainingPixels += 1;
        }

        const totalPixels = totalScratchPixelsRef.current || pixels.length / 4;
        if (remainingPixels / totalPixels < 1 - REVEAL_THRESHOLD) {
            revealDate();
        }
    };

    const scheduleRevealCheck = () => {
        if (progressFrameRef.current !== null) return;
        progressFrameRef.current = window.requestAnimationFrame(() => {
            progressFrameRef.current = null;
            checkRevealProgress();
        });
    };

    const scratchAt = (event: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas || !isScratchingRef.current || hasRevealedRef.current)
            return;

        const bounds = canvas.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;
        const context = canvas.getContext("2d");
        if (!context) return;

        context.save();
        context.globalCompositeOperation = "destination-out";
        const brush = context.createRadialGradient(x, y, 0, x, y, BRUSH_RADIUS);
        brush.addColorStop(0, "rgba(0, 0, 0, 1)");
        brush.addColorStop(0.7, "rgba(0, 0, 0, 0.7)");
        brush.addColorStop(1, "rgba(0, 0, 0, 0)");
        context.fillStyle = brush;
        context.beginPath();
        context.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2);
        context.fill();
        context.restore();
        scheduleRevealCheck();
    };

    const handlePointerDown = (
        event: React.PointerEvent<HTMLCanvasElement>,
    ) => {
        if (hasRevealedRef.current) return;
        isScratchingRef.current = true;
        try {
            event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
            // Safe fallback
        }
        scratchAt(event);
    };

    const handlePointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
        isScratchingRef.current = false;
        try {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId);
            }
        } catch {
            // Safe fallback
        }
        scheduleRevealCheck();
    };

    useEffect(
        () => () => {
            if (progressFrameRef.current !== null)
                window.cancelAnimationFrame(progressFrameRef.current);
        },
        [],
    );

    return (
        <>
            <div
                className={`save-date-heart ${isRevealed ? "save-date-scratch-revealed pointer-events-none" : ""}`}
            >
                <canvas
                    ref={canvasRef}
                    aria-label={t.saveTheDate.scratchInstruction}
                    className={`absolute inset-0 h-full w-full cursor-crosshair ${
                        isRevealed ? "pointer-events-none" : "touch-none"
                    }`}
                    onPointerDown={handlePointerDown}
                    onPointerMove={scratchAt}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                />
            </div>
            <button type="button" className="sr-only" onClick={revealDate}>
                {t.saveTheDate.revealButtonAria}
            </button>
        </>
    );
}

function FallingSaveDatePetals({ active }: { active: boolean }) {
    if (!active) return null;

    return (
        <div className="save-date-falling-petals" aria-hidden="true">
            {Array.from({ length: LEAF_COUNT }, (_, index) => (
                <span
                    key={index}
                    className="save-date-falling-petal"
                    style={
                        {
                            left: `${(index * 7.5 + 4) % 94}%`,
                            animationDelay: `${(index % 5) * 0.1}s`,
                            animationDuration: `${MIN_LEAF_DURATION + ((MAX_LEAF_DURATION - MIN_LEAF_DURATION) * (index % 4)) / 3}s`,
                            "--petal-size": `${10 + (index % 4) * 4}px`,
                            "--petal-drift": `${index % 2 === 0 ? 1 : -1}`,
                        } as React.CSSProperties
                    }
                />
            ))}
        </div>
    );
}

interface SaveTheDateProps {
    t: TranslationContent;
    lang?: Language;
}

export function SaveTheDate({ t }: SaveTheDateProps) {
    const [isRevealed, setIsRevealed] = useState(false);
    const [showFallingPetals, setShowFallingPetals] = useState(false);
    const hasTriggeredPetalsRef = useRef(false);
    const revealTimerRef = useRef<number | null>(null);
    const petalTimerRef = useRef<number | null>(null);

    useEffect(
        () => () => {
            if (revealTimerRef.current !== null)
                window.clearTimeout(revealTimerRef.current);
            if (petalTimerRef.current !== null)
                window.clearTimeout(petalTimerRef.current);
        },
        [],
    );

    const handleReveal = () => {
        setIsRevealed(true);
        if (!hasTriggeredPetalsRef.current) {
            hasTriggeredPetalsRef.current = true;
            revealTimerRef.current = window.setTimeout(() => {
                setShowFallingPetals(true);
                petalTimerRef.current = window.setTimeout(
                    () => setShowFallingPetals(false),
                    9000,
                );
            }, 700);
        }
    };

    return (
        <section
            id="save-the-date-section"
            className="save-date-section relative isolate flex min-h-[min(100svh,760px)] w-full items-center justify-center overflow-hidden px-4 py-6 sm:px-8"
        >
            <Image
                src={SAVE_DATE_BACKGROUND}
                alt=""
                fill
                priority
                sizes="(max-width: 620px) 100vw, 620px"
                className="object-cover object-top"
                unoptimized
            />
            <div
                className="save-date-wash absolute inset-0"
                aria-hidden="true"
            />
            <FallingSaveDatePetals active={showFallingPetals} />

            <div className="relative z-10 flex h-full w-full max-w-5xl flex-col items-center justify-start text-center">
                <p className="save-date-eyebrow">{t.saveTheDate.eyebrow}</p>
                <div
                    className="save-date-divider-wrap save-date-divider-wrap-eyebrow"
                    aria-hidden="true"
                >
                    <Image
                        src={ORNAMENTAL_DIVIDER}
                        alt=""
                        width={2172}
                        height={724}
                        priority
                        className="save-date-divider-img save-date-divider-eyebrow"
                    />
                </div>

                <svg
                    className="save-date-title save-date-title-curved"
                    viewBox="0 0 760 170"
                    role="img"
                    aria-label={t.saveTheDate.title}
                >
                    <defs>
                        <linearGradient
                            id="save-date-title-grad"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="80%"
                        >
                            <stop offset="0%" stopColor="#8d3824" />
                            <stop offset="40%" stopColor="#a74a32" />
                            <stop offset="70%" stopColor="#98402c" />
                            <stop offset="100%" stopColor="#b4573d" />
                        </linearGradient>
                        <path
                            id="save-date-curve"
                            d="M 35 125 Q 380 35 725 125"
                        />
                    </defs>
                    <text>
                        <textPath
                            href="#save-date-curve"
                            startOffset="50%"
                            textAnchor="middle"
                            fill="url(#save-date-title-grad)"
                        >
                            {t.saveTheDate.title}
                        </textPath>
                    </text>
                </svg>

                <div
                    className="save-date-divider-wrap save-date-divider-wrap-title"
                    aria-hidden="true"
                >
                    <Image
                        src={ORNAMENTAL_DIVIDER}
                        alt=""
                        width={2172}
                        height={724}
                        priority
                        className="save-date-divider-img save-date-divider-title"
                    />
                </div>

                <div className="save-date-card-wrap relative mt-7 w-full max-w-[760px]">
                    <div className="save-date-card-shadow" aria-hidden="true" />
                    <div className="save-date-card relative w-full">
                        <Image
                            src={HEART_BACKGROUND}
                            alt=""
                            fill
                            unoptimized
                            sizes="(max-width: 720px) 100vw, 720px"
                            className="save-date-card-bg-img"
                        />

                        <div
                            className="save-date-heart-content"
                            aria-live="polite"
                        >
                            <div
                                className={`save-date-date ${isRevealed ? "save-date-date-visible" : ""}`}
                            >
                                <strong>
                                    {t.saveTheDate.day}
                                    {t.saveTheDate.daySuffix && (
                                        <sup>{t.saveTheDate.daySuffix}</sup>
                                    )}
                                </strong>
                                <span>{t.saveTheDate.month}</span>
                                <div className="save-date-year-row">
                                    <i aria-hidden="true" />
                                    <span className="save-date-year">
                                        {t.saveTheDate.year}
                                    </span>
                                    <i aria-hidden="true" />
                                </div>
                                <span
                                    className="save-date-date-heart"
                                    aria-hidden="true"
                                >
                                    ♥
                                </span>
                            </div>
                            <ScratchHeart t={t} onReveal={handleReveal} />

                            <Image
                                src={HEART_FRAME}
                                alt=""
                                fill
                                sizes="(max-width: 640px) 92vw, 620px"
                                className="pointer-events-none z-20 object-contain"
                            />
                        </div>

                        <p className="save-date-footer">
                            {t.saveTheDate.footer}
                        </p>
                        <div
                            className="save-date-divider-wrap save-date-divider-wrap-card-footer"
                            aria-hidden="true"
                        >
                            <Image
                                src={ORNAMENTAL_DIVIDER}
                                alt=""
                                width={2172}
                                height={724}
                                className="save-date-divider-img save-date-divider-card-footer"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
