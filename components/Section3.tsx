"use client";

import Image from "next/image";
import { TranslationContent, Language } from "@/lib/translations";

const ARCH_BG = "/images/section3/archbg.webp";
const LEAF_DIVIDER = "/images/common/leaf_divider.webp";

interface Section3Props {
    t: TranslationContent;
    lang?: Language;
    groomFirst?: boolean;
}

export function Section3({ t, lang = "EN", groomFirst = true }: Section3Props) {
    const isTamil = lang === "TA" || t.countdown.days === "நாட்கள்";
    const firstName = groomFirst ? t.section3.groom : t.section3.bride;
    const secondName = groomFirst ? t.section3.bride : t.section3.groom;

    return (
        <section id="section-3" className="section3-section">
            <div
                className={`section3-artboard ${isTamil ? "section3-ta" : ""}`}
            >
                {/* Full-bleed Arch background with floral frames */}
                <Image
                    src={ARCH_BG}
                    alt="Wedding Invitation Arch Background"
                    fill
                    // priority
                    sizes="(max-width: 620px) 100vw, 620px"
                    className="section3-bg-img"
                    unoptimized
                />

                {/* Content Overlay */}
                <div className="section3-content">
                    <div
                        className="section3-top-divider-wrap"
                        aria-hidden="true"
                    >
                        <Image
                            src={LEAF_DIVIDER}
                            alt=""
                            width={2088}
                            height={213}
                            className="section3-divider-img"
                            unoptimized
                            // priority
                        />
                    </div>

                    {/* 1. Introductory lines */}
                    <div className="section3-intro">
                        <p className="section3-intro-line">
                            {t.section3.inviteLine1}
                        </p>
                        <p className="section3-intro-line">
                            {t.section3.inviteLine2}
                        </p>
                        <p className="section3-intro-line">
                            {t.section3.inviteLine3}
                        </p>
                    </div>

                    {/* 2. Couple Names */}
                    <div className="section3-names-wrap">
                        <h2 className="section3-name section3-groom-name">
                            {firstName}
                        </h2>

                        <div className="section3-amp-wrap" aria-hidden="true">
                            <span className="section3-amp">
                                {t.section3.ampersand || "&"}
                            </span>
                        </div>

                        <h2 className="section3-name section3-bride-name">
                            {secondName}
                        </h2>
                    </div>

                    {/* 3. Scripture Verse */}
                    <div className="section3-verse-wrap">
                        <p className="section3-verse-quote">
                            {t.section3.verseLine1}
                            <br />
                            {t.section3.verseLine2}
                        </p>
                        <p className="section3-verse-ref">
                            {t.section3.verseRef}
                        </p>
                    </div>

                    <div
                        className="section3-middle-divider-wrap"
                        aria-hidden="true"
                    >
                        <Image
                            src={LEAF_DIVIDER}
                            alt=""
                            width={2088}
                            height={213}
                            className="section3-divider-img"
                            unoptimized
                            // priority
                        />
                    </div>

                    {/* 4. Date & Time Block */}
                    <div className="section3-date-wrap">
                        <div className="section3-date-row">
                            <span className="section3-month">
                                {t.section3.month}
                            </span>
                            <span
                                className="section3-v-rule"
                                aria-hidden="true"
                            />
                            <span className="section3-day">
                                {t.section3.day}
                            </span>
                            <span
                                className="section3-v-rule"
                                aria-hidden="true"
                            />
                            <span className="section3-year">
                                {t.section3.year}
                            </span>
                        </div>

                        <p className="section3-weekday">{t.section3.weekday}</p>
                    </div>

                    {/* 5. Golden Leaf Divider */}
                    <div className="section3-divider-wrap" aria-hidden="true">
                        <Image
                            src={LEAF_DIVIDER}
                            alt=""
                            width={2088}
                            height={213}
                            className="section3-divider-img"
                            unoptimized
                            // priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
