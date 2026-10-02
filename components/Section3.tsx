'use client';

import Image from 'next/image';

const SECTION3 = '/images/section3';

function Art({
  src,
  alt = '',
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

export function Section3() {
  return (
    <section id="section-3" className="section3-section">
      <div className="section3-artboard">
        <Image
          src={`${SECTION3}/Dreamy Floral Chapel Wedding Frame.png`}
          alt=""
          fill
          unoptimized
          priority
          sizes="(max-width: 760px) 100vw, 760px"
          className="section3-bg"
        />

        <div className="section3-overlay">
          <Art
            src="Golden Cross and Symmetrical Floral Garland.png"
            className="section3-cross"
            width={1991}
            height={790}
          />

          <p className="section3-blessing">
            With God&apos;s grace and the blessings of our families,
            <br />
            we joyfully invite you to celebrate
            <br />
            the beginning of our journey together.
          </p>

          <Art
            src="Watercolor Floral Divider with Golden Accents.png"
            className="section3-divider"
            width={1991}
            height={790}
          />

          <div className="section3-bride">
            <h2>Irene</h2>
            <p className="section3-relation">Daughter of</p>
            <p className="section3-parents">
              Mr. S. Mariadurai &amp; Mrs. Manimatha Mariadurai
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
            <h2>Franklin</h2>
            <p className="section3-relation">Son of</p>
            <p className="section3-parents">
              late Mr. G. Rajan &amp; Mrs. Regina Rajan
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
              <h3>WEDDING</h3>
              <DiamondRule />
              <div className="section3-meta">
                <Art
                  src="Glossy Terracotta Calendar Icon.png"
                  className="section3-meta-icon section3-cal"
                  width={1374}
                  height={1145}
                />
                <div className="section3-meta-text">
                  <p>16 NOVEMBER 2026</p>
                  <p>MONDAY</p>
                </div>
              </div>
              <div className="section3-meta">
                <Art
                  src="terracotta-clock.svg"
                  className="section3-meta-icon section3-clock"
                  width={128}
                  height={128}
                />
                <p>10:00 AM</p>
              </div>
            </article>

            <div className="section3-events-rule" aria-hidden="true" />

            <article className="section3-event">
              <Art
                src="Golden Champagne Toast Icon.png"
                className="section3-toast"
                width={1374}
                height={1145}
              />
              <h3>RECEPTION</h3>
              <DiamondRule />
              <div className="section3-meta">
                <Art
                  src="Glossy Terracotta Calendar Icon.png"
                  className="section3-meta-icon section3-cal"
                  width={1374}
                  height={1145}
                />
                <div className="section3-meta-text">
                  <p>16 NOVEMBER 2026</p>
                  <p>MONDAY</p>
                </div>
              </div>
              <div className="section3-meta">
                <Art
                  src="terracotta-clock.svg"
                  className="section3-meta-icon section3-clock"
                  width={128}
                  height={128}
                />
                <p>1:00 PM ONWARDS</p>
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
            <h3>VENUE</h3>
            <DiamondRule />
            <p>C.S.I. St. Paul&apos;s Church</p>
            <p>Keelkattalai, Tamil Nadu</p>
          </div>
        </div>
      </div>
    </section>
  );
}
