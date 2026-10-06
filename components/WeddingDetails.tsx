"use client";

import React from "react";
import Image from "next/image";
import { TranslationContent, Language } from "@/lib/translations";

const VENUE = "/images/venue";

interface WeddingDetailsProps {
    t: TranslationContent;
    lang?: Language;
}

export const WeddingDetails: React.FC<WeddingDetailsProps> = ({ t }) => {
    const googleMapsUrl =
        "https://www.google.com/maps/search/?api=1&query=C.S.I.+St.+Paul%27s+Church+Keelkantalai+Tamil+Nadu";

    return (
        <section id="venue-section" className="venue-section">
            {/* Outer floral parchment background */}
            <Image
                src="/images/savedate/Vintage Floral Wedding Invitation Background.png"
                alt=""
                fill
                sizes="100vw"
                className="venue-outer-bg"
                priority
            />

            {/* Inner ornate floral frame card */}
            <div className="venue-artboard">
                <Image
                    src={`${VENUE}/secondbg.png`}
                    alt=""
                    fill
                    sizes="(max-width: 760px) 100vw, 760px"
                    className="venue-frame-bg"
                    priority
                />

                {/* Content overlay */}
                <div className="venue-overlay">
                    {/* "Venue" script heading */}
                    <h2 className="venue-title">{t.venue.title}</h2>

                    {/* "WHERE WE CELEBRATE" subtitle */}
                    <p className="venue-subtitle">{t.venue.subtitle}</p>

                    {/* Diamond divider */}
                    <div className="venue-rule" aria-hidden="true">
                        <span />
                    </div>

                    {/* Church name */}
                    <h3 className="venue-church-name">{t.venue.churchName}</h3>

                    {/* Location */}
                    <p className="venue-location">{t.venue.location}</p>

                    {/* Diamond divider below location */}
                    <div
                        className="venue-rule venue-rule-lower"
                        aria-hidden="true"
                    >
                        <span />
                    </div>

                    {/* Wedding & Reception columns */}
                    <div className="venue-events">
                        {/* Wedding column */}
                        <article className="venue-event">
                            <div className="venue-event-icon">
                                <Image
                                    src={`${VENUE}/Interlocked Golden Wedding Rings.png`}
                                    alt="Wedding rings"
                                    width={1024}
                                    height={494}
                                    unoptimized
                                    className="venue-rings-img"
                                />
                            </div>
                            <h4 className="venue-event-label">
                                {t.venue.weddingLabel}
                            </h4>
                            <div className="venue-time-row">
                                <div className="venue-clock-icon">
                                    <Image
                                        src={`${VENUE}/Rose Gold Transparent Clock Icon.png`}
                                        alt="Clock"
                                        width={1100}
                                        height={1100}
                                        unoptimized
                                        className="venue-clock-img"
                                    />
                                </div>
                                <span className="venue-time-text">
                                    {t.venue.weddingTime}
                                </span>
                            </div>
                        </article>

                        {/* Central diamond + vertical divider */}
                        <div
                            className="venue-events-divider"
                            aria-hidden="true"
                        >
                            <div className="venue-events-diamond" />
                            <div className="venue-events-line" />
                        </div>

                        {/* Reception column */}
                        <article className="venue-event">
                            <div className="venue-event-icon">
                                <Image
                                    src={`${VENUE}/Golden Champagne Toast Icon.png`}
                                    alt="Champagne toast"
                                    width={1200}
                                    height={1000}
                                    unoptimized
                                    className="venue-toast-img"
                                />
                            </div>
                            <h4 className="venue-event-label">
                                {t.venue.receptionLabel}
                            </h4>
                            <div className="venue-time-row">
                                <div className="venue-clock-icon">
                                    <Image
                                        src={`${VENUE}/Rose Gold Transparent Clock Icon.png`}
                                        alt="Clock"
                                        width={1100}
                                        height={1100}
                                        unoptimized
                                        className="venue-clock-img"
                                    />
                                </div>
                                <span className="venue-time-text">
                                    {t.venue.receptionTime}
                                </span>
                            </div>
                        </article>
                    </div>

                    {/* "OPEN IN MAPS" button */}
                    <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        id="open-in-maps-btn"
                        className="venue-maps-btn"
                        aria-label="Open venue location in Google Maps (opens in new tab)"
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
        </section>
    );
};
