import type { Metadata } from "next";
import {
    Cormorant_Garamond,
    Great_Vibes,
    DM_Sans,
    Pinyon_Script,
    Carattere,
    Libre_Bodoni,
} from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

const cormorant = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    style: ["normal", "italic"],
    variable: "--font-cormorant",
    display: "swap",
});

const greatVibes = Great_Vibes({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-great-vibes",
    display: "swap",
});

/** Script used on the reference invitation for Irene & Franklin */
const pinyonScript = Pinyon_Script({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-pinyon",
    display: "swap",
});

const carattere = Carattere({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-carattere",
});

const libreBodoni = Libre_Bodoni({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-libre-bodoni",
});

const dmSans = DM_Sans({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-dm-sans",
    display: "swap",
});

const siteUrl = "https://youre-cordially-invited.vercel.app";

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: "Wedding Invitation",
    description: "Join us to celebrate!",
    icons: {
        icon: [
            { url: "/favicon.ico" },
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        ],
        apple: [
            {
                url: "/apple-touch-icon.png",
                sizes: "180x180",
                type: "image/png",
            },
        ],
    },
    manifest: "/site.webmanifest",
    openGraph: {
        title: "Wedding Invitation",
        description: "Join us to celebrate!",
        url: "/",
        siteName: "Wedding Invitation",
        images: [
            {
                url: "/og-v2.jpg",
                width: 1024,
                height: 1536,
                alt: "Wedding Invitation",
                type: "image/jpeg",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Wedding Invitation",
        description: "Join us to celebrate!",
        images: ["og-v2.jpg"],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={`${cormorant.variable} ${greatVibes.variable} ${pinyonScript.variable} ${dmSans.variable} ${carattere.variable} ${libreBodoni.variable} h-full`}
        >
            <head>
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/apple-touch-icon.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicon-16x16.png"
                />
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Condensed:ital,wght@0,400;0,700;1,400;1,700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="min-h-full font-serif bg-[#FAF7F5] text-[#3D251E] antialiased selection:bg-[#E3BDB0] selection:text-[#9F4B31]">
                <SmoothScroll />
                {children}
            </body>
        </html>
    );
}
