"use client";

import Image from "next/image";
import { TranslationContent, Language } from "@/lib/translations";

const SECTION3 = "/images/section3";
const VINTAGE_BG =
    "/images/section3/Vintage Floral Wedding Invitation Background.png";

function Art({
    src,
    alt = "",
    className,
    width,
    height,
}: {
    src: string;
    alt?: string;
    className: string;
    width: number;
    height: number;
}) {
    return (
        <div className={className}>
            <Image
                src={`${SECTION3}/${src}`}
                alt={alt}
                width={width}
                height={height}
                unoptimized
                priority={false}
            />
        </div>
    );
}

function DiamondRule() {
    return (
        <div className="section3-rule" aria-hidden="true">
            <span />
        </div>
    );
}

interface Section3Props {
    t: TranslationContent;
    lang?: Language;
}

export function Section3({ t }: Section3Props) {
    return (
        <section id="section-3" className="section3-section">
            <Image
                src={VINTAGE_BG}
                alt=""
                fill
                priority
                sizes="100vw"
                className="pointer-events-none select-none object-cover object-center"
            />
            <div className="section3-artboard">
                <div className="section3-overlay">
                    <Art
                        src="Golden Cross and Symmetrical Floral Garland.png"
                        className="section3-cross"
                        width={1991}
                        height={790}
                    />

                    <p className="section3-blessing">
                        {t.section3.blessingLine1}
                        <br />
                        {t.section3.blessingLine2}
                        <br />
                        {t.section3.blessingLine3}
                    </p>

                    <Art
                        src="Watercolor Floral Divider with Golden Accents.png"
                        className="section3-divider"
                        width={1991}
                        height={790}
                    />

                    <div className="section3-bride">
                        <h2>{t.section3.bride}</h2>
                        <p className="section3-relation">
                            {t.section3.brideRelation}
                        </p>
                        <p className="section3-parents">
                            {t.section3.brideParents}
                        </p>
                    </div>

                    <div className="section3-ampersand">
                        <Art
                            src="Cream Peach Floral Spray with Sage Leaves.png"
                            className="section3-sprig section3-sprig-left"
                            width={1991}
                            height={790}
                        />
                        <span>&amp;</span>
                        <Art
                            src="Cream Blossoms and Olive Leaf Garland.png"
                            className="section3-sprig section3-sprig-right"
                            width={1991}
                            height={790}
                        />
                    </div>

                    <div className="section3-groom">
                        <h2>{t.section3.groom}</h2>
                        <p className="section3-relation">
                            {t.section3.groomRelation}
                        </p>
                        <p className="section3-parents">
                            {t.section3.groomParents}
                        </p>
                    </div>

                    <div className="section3-events">
                        <article className="section3-event">
                            <Art
                                src="Interlocked Golden Wedding Rings.png"
                                className="section3-rings"
                                width={1806}
                                height={871}
                            />
                            <h3>{t.section3.weddingTitle}</h3>
                            <DiamondRule />
                            <div className="section3-meta">
                                <Art
                                    src="Glossy Terracotta Calendar Icon.png"
                                    className="section3-meta-icon section3-cal"
                                    width={1374}
                                    height={1145}
                                />
                                <div className="section3-meta-text">
                                    <p>{t.section3.weddingDate}</p>
                                    <p>{t.section3.weddingDay}</p>
                                </div>
                            </div>
                            <div className="section3-meta">
                                <Art
                                    src="terracotta-clock.svg"
                                    className="section3-meta-icon section3-clock"
                                    width={128}
                                    height={128}
                                />
                                <p>{t.section3.weddingTime}</p>
                            </div>
                        </article>

                        <div
                            className="section3-events-rule"
                            aria-hidden="true"
                        />

                        <article className="section3-event">
                            <Art
                                src="Golden Champagne Toast Icon.png"
                                className="section3-toast"
                                width={1374}
                                height={1145}
                            />
                            <h3>{t.section3.receptionTitle}</h3>
                            <DiamondRule />
                            <div className="section3-meta">
                                <Art
                                    src="Glossy Terracotta Calendar Icon.png"
                                    className="section3-meta-icon section3-cal"
                                    width={1374}
                                    height={1145}
                                />
                                <div className="section3-meta-text">
                                    <p>{t.section3.receptionDate}</p>
                                    <p>{t.section3.receptionDay}</p>
                                </div>
                            </div>
                            <div className="section3-meta">
                                <Art
                                    src="terracotta-clock.svg"
                                    className="section3-meta-icon section3-clock"
                                    width={128}
                                    height={128}
                                />
                                <p>{t.section3.receptionTime}</p>
                            </div>
                        </article>
                    </div>

                    <div className="section3-venue">
                        <Art
                            src="Elegant Golden Church Emblem with Foliage.png"
                            className="section3-church"
                            width={2122}
                            height={741}
                        />
                        <h3>{t.section3.venueTitle}</h3>
                        <DiamondRule />
                        <p>{t.section3.venueChurch}</p>
                        <p>{t.section3.venueLocation}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
