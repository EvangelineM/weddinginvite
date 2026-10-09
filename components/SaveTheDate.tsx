"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { TranslationContent, Language } from "@/lib/translations";

const HEART_FRAME = "/images/savedate/Ornate Rose-Gold Floral Heart Frame.png";
const GOLD_HEART_TEXTURE = "/images/savedate/Golden Foil Heart Cutout.png";
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
const FOIL_X = -0.035;
const FOIL_Y = 0.015;
const FOIL_WIDTH = 1.07;
const FOIL_HEIGHT = 0.97;



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
            if (!goldImage.complete || goldImage.naturalWidth === 0) return;
            const goldBase = context.createLinearGradient(
                0,
                0,
                bounds.width,
                bounds.height,
            );
            goldBase.addColorStop(0, "#c58b42");
            goldBase.addColorStop(0.45, "#9f642f");
            goldBase.addColorStop(1, "#c18a42");
            context.fillStyle = goldBase;
            context.fillRect(0, 0, bounds.width, bounds.height);
            const foilX = bounds.width * FOIL_X;
            const foilY = bounds.height * FOIL_Y;
            const foilWidth = bounds.width * FOIL_WIDTH;
            const foilHeight = bounds.height * FOIL_HEIGHT;
            context.drawImage(goldImage, foilX, foilY, foilWidth, foilHeight);

            context.fillStyle = "#fff4d4";
            context.textAlign = "center";
            context.textBaseline = "middle";
            const serifFont =
                getComputedStyle(document.documentElement)
                    .getPropertyValue("--font-cormorant")
                    .trim() || "Georgia, serif";
            context.font = `700 ${Math.max(9, bounds.width * 0.035)}px ${serifFont}`;
            context.fillText(
                t.saveTheDate.scratchInstruction,
                bounds.width / 2,
                bounds.height * 0.49,
            );
            context.font = `italic 600 ${Math.max(8, bounds.width * 0.027)}px ${serifFont}`;
            context.fillText(
                t.saveTheDate.scratchSubtitle,
                bounds.width / 2,
                bounds.height * 0.57,
            );

            context.globalCompositeOperation = "destination-in";
            context.drawImage(goldImage, foilX, foilY, foilWidth, foilHeight);
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
        drawGoldLayer();
        const resizeObserver = new ResizeObserver(drawGoldLayer);
        resizeObserver.observe(canvas);
        return () => {
            goldImage.onload = null;
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
                sizes="100vw"
                className="object-cover object-top"
            />
            <div
                className="save-date-wash absolute inset-0"
                aria-hidden="true"
            />
            <FallingSaveDatePetals active={showFallingPetals} />

            <div className="relative z-10 flex h-full w-full max-w-5xl flex-col items-center justify-start text-center">
                <p className="save-date-eyebrow">{t.saveTheDate.eyebrow}</p>
                <div className="save-date-divider-wrap save-date-divider-wrap-eyebrow" aria-hidden="true">
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
                    >
                    {t.saveTheDate.title}
                    </textPath>
                </text>
                </svg>

                <div className="save-date-divider-wrap save-date-divider-wrap-title" aria-hidden="true">
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
                            sizes="(max-width: 640px) 92vw, 620px"
                            className="save-date-card-bg-img object-contain"
                        />
                        <div className="save-date-card-heading">
                            <CalendarDays
                                aria-hidden="true"
                                className="h-6 w-6"
                                strokeWidth={1.8}
                            />
                            <span>{t.saveTheDate.cardHeading}</span>
                        </div>
                        <div
                            className="save-date-divider-wrap save-date-divider-wrap-card-heading"
                            aria-hidden="true"
                        >
                            <Image
                                src={ORNAMENTAL_DIVIDER}
                                alt=""
                                width={2172}
                                height={724}
                                className="save-date-divider-img save-date-divider-card-heading"
                            />
                        </div>

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
                                unoptimized
                                className="pointer-events-none z-20 object-contain scale-[1.15] "
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
