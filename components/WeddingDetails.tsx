"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { CalendarHeart } from "lucide-react";
import { TranslationContent, Language } from "@/lib/translations";

const VENUE = "/images/venue";
const VIDEO_WEBM =
    "https://res.cloudinary.com/jcjsrbvw/video/upload/v1792347971/Fairytale_wedding_video_opening_20261018032819.webm";
const VIDEO_MP4 =
    "https://res.cloudinary.com/jcjsrbvw/video/upload/v1792354785/church.mp4";

interface WeddingDetailsProps {
    t: TranslationContent;
    lang?: Language;
}

export const WeddingDetails: React.FC<WeddingDetailsProps> = ({
    t,
    lang = "EN",
}) => {
    const isTamil = lang === "TA" || t.countdown.days === "நாட்கள்";

    const sectionRef = useRef<HTMLElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const [cardVisible, setCardVisible] = useState(false);
    const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const googleMapsUrl =
        "https://www.google.com/maps/search/?api=1&query=C.S.I.+St.+Paul%27s+Church+Keelkantalai+Tamil+Nadu";

    /* ── Trigger card reveal ── */
    const triggerCardReveal = useCallback(() => {
        setCardVisible(true);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    /* ── Start video & set 10-second reveal timer ── */

    const startVideoAndTimer = useCallback(() => {
        if (!videoRef.current || hasStartedPlaying) return;

        setHasStartedPlaying(true);

        videoRef.current.play().catch(() => {
            // If playback is blocked or fails, reveal the card immediately
            triggerCardReveal();
        });
    }, [hasStartedPlaying, triggerCardReveal]);

    /* ── Start video when section is in viewport ── */
    const handleIntersection = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !hasStartedPlaying) {
                    startVideoAndTimer();
                }
            });
        },
        [hasStartedPlaying, startVideoAndTimer],
    );

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.75,
        });

        observer.observe(section);

        return () => {
            observer.disconnect();
        };
    }, [handleIntersection]);

    /* ── Reveal card 3 seconds before video ends ── */
    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (!video || !Number.isFinite(video.duration)) return;

        if (video.currentTime >= video.duration - 2) {
            triggerCardReveal();
        }
    };

    /* ── If video ends before the reveal, reveal the card ── */
    const handleVideoEnded = () => {
        triggerCardReveal();
    };

    return (
        <section id="venue-section" className="venue-section" ref={sectionRef}>
            {/* ── Full-bleed background video ── */}
            <video
                ref={videoRef}
                className="venue-video-bg"
                muted
                playsInline
                preload="auto"
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnded}
            >
                <source src={VIDEO_WEBM} type="video/webm" />
                <source src={VIDEO_MP4} type="video/mp4" />
            </video>

            {/* ── Card overlay — smoothly reveals at 10s after video starts ── */}
            <div
                className={`venue-card-wrapper ${cardVisible ? "venue-card-visible" : ""}`}
            >
                <div className={`venue-card ${isTamil ? "venue-card-ta" : ""}`}>
                    {/* Card frame image */}
                    <Image
                        src={`${VENUE}/card.png`}
                        alt=""
                        fill
                        sizes="(max-width: 620px) 88vw, 520px"
                        className="venue-card-bg"
                        priority
                    />

                    {/* Content overlay */}
                    <div className="venue-card-content">
                        {/* Script "Venue" title */}
                        <h2 className="venue-title">{t.venue.title}</h2>

                        {/* Subtitle */}
                        <p className="venue-subtitle">{t.venue.subtitle}</p>

                        {/* Leaf divider 1 */}
                        <div className="venue-leaf-divider" aria-hidden="true">
                            <Image
                                src={`${VENUE}/leaf_divider.png`}
                                alt=""
                                width={2088}
                                height={213}
                                className="venue-leaf-img"
                                unoptimized
                            />
                        </div>

                        {/* Church name */}
                        <h3 className="venue-church-name">
                            {t.venue.churchName}
                        </h3>

                        {/* Location */}
                        <p className="venue-location">{t.venue.location}</p>

                        {/* Leaf divider 2 */}
                        <div
                            className="venue-leaf-divider venue-leaf-divider-2"
                            aria-hidden="true"
                        >
                            <Image
                                src={`${VENUE}/leaf_divider.png`}
                                alt=""
                                width={2088}
                                height={213}
                                className="venue-leaf-img"
                                unoptimized
                            />
                        </div>

                        {/* Wedding Date above timings */}
                        <p className="venue-wedding-date">{t.venue.date}</p>

                        {/* Wedding & Reception columns */}
                        <div className="venue-events">
                            {/* Wedding column */}
                            <div className="venue-event">
                                <h4 className="venue-event-label">
                                    {t.venue.weddingLabel}
                                </h4>
                                <div className="venue-time-row">
                                    {/* Calendar icon: CalendarHeart from lucide-react */}
                                    <CalendarHeart
                                        className="venue-cal-icon"
                                        strokeWidth={1.8}
                                        aria-hidden="true"
                                    />
                                    <span className="venue-time-text">
                                        {t.venue.weddingTime}
                                    </span>
                                </div>
                            </div>

                            {/* Central divider: top vertical line, middle diamond, bottom vertical line matching reference */}
                            <div
                                className="venue-events-divider"
                                aria-hidden="true"
                            >
                                <svg
                                    className="venue-events-divider-svg"
                                    viewBox="0 0 14 74"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <line
                                        x1="7"
                                        y1="0"
                                        x2="7"
                                        y2="31"
                                        stroke="currentColor"
                                        strokeWidth="1.2"
                                    />
                                    <rect
                                        x="3.2"
                                        y="33.2"
                                        width="7.6"
                                        height="7.6"
                                        transform="rotate(45 7 37)"
                                        stroke="currentColor"
                                        strokeWidth="1.2"
                                        fill="none"
                                    />
                                    <line
                                        x1="7"
                                        y1="43"
                                        x2="7"
                                        y2="74"
                                        stroke="currentColor"
                                        strokeWidth="1.2"
                                    />
                                </svg>
                            </div>

                            {/* Reception column */}
                            <div className="venue-event">
                                <h4 className="venue-event-label">
                                    {t.venue.receptionLabel}
                                </h4>
                                <div className="venue-time-row">
                                    <CalendarHeart
                                        className="venue-cal-icon"
                                        strokeWidth={1.8}
                                        aria-hidden="true"
                                    />
                                    <span className="venue-time-text">
                                        {t.venue.receptionTime}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* "OPEN IN MAPS" button */}
                        <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            id="open-in-maps-btn"
                            className="venue-maps-btn"
                            aria-label="Open venue location in Google Maps"
                        >
                            <svg
                                className="venue-maps-pin"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span className="venue-maps-label">
                                {t.venue.openInMaps}
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};
