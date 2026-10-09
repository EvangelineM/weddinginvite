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

export const metadata: Metadata = {
    title: "The Wedding of Irene & Franklin | Château de la Couronne",
    description:
        "Join us to celebrate the wedding of Irene & Franklin on 16 November 2026 at Château de la Couronne, Nouvelle-Aquitaine, France.",
    openGraph: {
        title: "The Wedding of Irene & Franklin",
        description: "16 November 2026 • Château de la Couronne, France",
        type: "website",
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
            <body className="min-h-full font-serif bg-[#FAF7F5] text-[#3D251E] antialiased selection:bg-[#E3BDB0] selection:text-[#9F4B31]">
                <SmoothScroll />
                {children}
            </body>
        </html>
    );
}
