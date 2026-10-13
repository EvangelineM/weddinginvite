
"use client";

import Image from "next/image";
import { TranslationContent, Language } from "@/lib/translations";

const SECTION3 = "/images/section3";
const VINTAGE_BG = "/images/section3/invitebg.PNG";

interface ArtProps {
    src: string;
    alt?: string;
    className: string;
    width: number;
    height: number;
}

function Art({
    src,
    alt = "",
    className,
    width,
    height,
}: ArtProps) {
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

interface Section3Props {
    t: TranslationContent;
    lang?: Language;
}

export function Section3({ t }: Section3Props) {
    return (
        <section
            id="section-3"
            className="section3-section"
        >
            <Image
                src={VINTAGE_BG}
                alt=""
                fill
                priority
                sizes="(max-width: 620px) 100vw, 620px"
                unoptimized
                className="pointer-events-none select-none object-cover object-center"
            />

            <div className="section3-artboard">
                <div className="section3-overlay">
                    <p className="section3-blessing">
                        {t.section3.blessingLine1}
                        <br />
                        {t.section3.blessingLine2}
                        <br />
                        {t.section3.blessingLine3}
                    </p>

                    <div className="section3-bride">
                        <h2>{t.section3.bride}</h2>
                    </div>

                    <div className="section3-ampersand">
                        <span>&amp;</span>
                    </div>

                    <div className="section3-groom">
                        <h2>{t.section3.groom}</h2>
                    </div>
                </div>
            </div>
        </section>
    );
}
