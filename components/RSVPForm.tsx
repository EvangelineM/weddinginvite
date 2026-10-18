"use client";

import React, { useState } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { TranslationContent, Language } from "@/lib/translations";

const RSVP_DIR = "/images/rsvp";

interface RSVPFormProps {
    t: TranslationContent;
    lang?: Language;
}

export const RSVPForm: React.FC<RSVPFormProps> = ({ t, lang = "EN" }) => {
    const isTamil = lang === "TA" || t.countdown.days === "நாட்கள்";

    const [attendance, setAttendance] = useState<"attending" | "declined" | "">("");
    const [fullName, setFullName] = useState("");
    const [guestsCount, setGuestsCount] = useState<string>("1");
    const [message, setMessage] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [lastSubmittedAttendance, setLastSubmittedAttendance] = useState<"attending" | "declined" | "">("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleIncrementGuests = (e: React.MouseEvent) => {
        e.preventDefault();
        const current = parseInt(guestsCount, 10);
        const next = isNaN(current) ? 1 : Math.min(20, current + 1);
        setGuestsCount(String(next));
        if (errorMessage) setErrorMessage(null);
    };

    const handleDecrementGuests = (e: React.MouseEvent) => {
        e.preventDefault();
        const current = parseInt(guestsCount, 10);
        const next = isNaN(current) ? 1 : Math.max(1, current - 1);
        setGuestsCount(String(next));
        if (errorMessage) setErrorMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        if (!fullName.trim()) {
            setErrorMessage(t.rsvp.validationName);
            return;
        }

        if (!attendance) {
            setErrorMessage(t.rsvp.validationAttendance);
            return;
        }

        const parsedGuests = parseInt(guestsCount, 10);
        if (attendance === "attending" && (!guestsCount.trim() || isNaN(parsedGuests) || parsedGuests < 1)) {
            setErrorMessage(t.rsvp.validationGuests || "Please enter the number of guests.");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/rsvp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    full_name: fullName.trim(),
                    attendance,
                    guests_count: attendance === "attending" ? parsedGuests : 0,
                    message: message.trim() || undefined,
                }),
            });

            const result = await res.json();

            if (!res.ok || !result.success) {
                throw new Error(result.error || t.rsvp.errorMessage);
            }

            setLastSubmittedAttendance(attendance);

            if (attendance === "attending") {
                try {
                    confetti({
                        particleCount: 65,
                        spread: 70,
                        origin: { y: 0.65 },
                        colors: [
                            "#E3BDB0",
                            "#D28B77",
                            "#BD8167",
                            "#9F4B31",
                            "#AF8D60",
                            "#FFFDFB",
                        ],
                    });
                } catch {
                    /* Confetti fallback */
                }
            }

            setIsSuccess(true);
        } catch {
            setErrorMessage(t.rsvp.errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setIsSuccess(false);
        setFullName("");
        setGuestsCount("1");
        setMessage("");
        setAttendance("");
        setLastSubmittedAttendance("");
        setErrorMessage(null);
    };

    return (
        <section id="rsvp-section" className="rsvp-section">
            <div className={`rsvp-artboard ${isTamil ? "rsvp-ta" : ""}`}>
                {/* 1. Botanical Framed Background */}
                <Image
                    src={`${RSVP_DIR}/rsvp_bg.png`}
                    alt="RSVP Background"
                    fill
                    sizes="(max-width: 620px) 100vw, 620px"
                    className="rsvp-bg"
                    priority
                    unoptimized
                />

                {/* 2. RSVP Content Layer */}
                <div className="rsvp-overlay">
                    {/* ── Top Golden Leaf Divider ── */}
                    <div className="rsvp-top-divider-wrap" aria-hidden="true">
                        <Image
                            src={`${RSVP_DIR}/top_divider.png`}
                            alt=""
                            width={2172}
                            height={724}
                            className="rsvp-divider-img"
                            priority
                            unoptimized
                        />
                    </div>

                    {/* ── RSVP Text Heading ── */}
                    <div className="rsvp-title-wrap">
                        <h2 className="rsvp-title-text">
                            {t.rsvp.title.includes("\n") ? (
                                t.rsvp.title.split("\n").map((part, idx) => (
                                    <span key={idx} className="rsvp-title-line">
                                        {part.trim()}
                                    </span>
                                ))
                            ) : (
                                t.rsvp.title
                            )}
                        </h2>
                    </div>


                    {/* ── Middle Diamond Floral Divider ── */}
                    <div className="rsvp-middle-divider-wrap" aria-hidden="true">
                        <Image
                            src={`${RSVP_DIR}/middle_divider.png`}
                            alt=""
                            width={2172}
                            height={724}
                            className="rsvp-divider-img"
                            priority
                            unoptimized
                        />
                    </div>

                    {/* ── Success or Declined Submission State (Directly on BG) ── */}
                    {isSuccess ? (
                        <div className="rsvp-result-wrap">
                            {lastSubmittedAttendance === "declined" ? (
                                <div className="rsvp-result-content rsvp-declined-content">
                                    <p className="rsvp-declined-line rsvp-declined-line-1">
                                        {t.rsvp.declinedLine1 || "Thank you for letting us know."}
                                    </p>
                                    <p className="rsvp-declined-line rsvp-declined-line-2">
                                        {t.rsvp.declinedLine2 || "You’ll be dearly missed!"}
                                    </p>
                                    <p className="rsvp-declined-line rsvp-declined-line-3">
                                        {t.rsvp.declinedLine3 || "Sending love and blessings your way."}
                                    </p>
                                </div>
                            ) : (
                                <div className="rsvp-result-content">
                                    <h3 className="rsvp-success-heading">
                                        {t.rsvp.successHeading}
                                    </h3>
                                    <p className="rsvp-success-message">
                                        {t.rsvp.successMessage}
                                    </p>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={handleReset}
                                className="rsvp-send-button rsvp-reset-button"
                            >
                                <Image
                                    src={`${RSVP_DIR}/send_button.png`}
                                    alt=""
                                    fill
                                    className="rsvp-send-btn-frame"
                                    unoptimized
                                    priority
                                />
                                <span className="rsvp-send-btn-label rsvp-reset-btn-label">
                                    {t.rsvp?.sendAnother || "SUBMIT AGAIN"}
                                </span>
                            </button>
                        </div>
                    ) : (
                        /* ── Interactive RSVP Form ── */
                        <form onSubmit={handleSubmit} className="rsvp-form">
                            {/* Error Banner */}
                            {errorMessage && (
                                <div className="rsvp-error-banner" role="alert">
                                    {errorMessage}
                                </div>
                            )}

                            {/* 1. Full Name */}
                            <div className="rsvp-field">
                                <label
                                    htmlFor="rsvp-fullname"
                                    className="rsvp-label"
                                >
                                    {t.rsvp.nameLabel}
                                </label>
                                <div className="rsvp-input-frame-box">
                                    <Image
                                        src={`${RSVP_DIR}/input_frame.png`}
                                        alt=""
                                        fill
                                        className="rsvp-frame-img"
                                        unoptimized
                                        priority
                                    />
                                    <input
                                        id="rsvp-fullname"
                                        type="text"
                                        required
                                        placeholder={t.rsvp.namePlaceholder}
                                        value={fullName}
                                        onChange={(e) => {
                                            setFullName(e.target.value);
                                            if (errorMessage) setErrorMessage(null);
                                        }}
                                        className="rsvp-input"
                                    />
                                </div>
                            </div>

                            {/* 2. Attendance (Yes / No side-by-side) */}
                            <div className="rsvp-field">
                                <span className="rsvp-label">
                                    {t.rsvp.attendingQuestion}
                                </span>
                                <div className="rsvp-radio-row">
                                    {/* Yes Card */}
                                    <button
                                        type="button"
                                        role="radio"
                                        aria-checked={attendance === "attending"}
                                        onClick={() => {
                                            setAttendance("attending");
                                            if (errorMessage) setErrorMessage(null);
                                        }}
                                        className={`rsvp-radio-card ${
                                            attendance === "attending"
                                                ? "rsvp-radio-card-active"
                                                : ""
                                        }`}
                                    >
                                        <Image
                                            src={`${RSVP_DIR}/radio_frame.png`}
                                            alt=""
                                            fill
                                            className="rsvp-frame-img"
                                            unoptimized
                                            priority
                                        />
                                        <span className="rsvp-radio-circle">
                                            {attendance === "attending" && (
                                                <span className="rsvp-radio-dot" />
                                            )}
                                        </span>
                                        <span className="rsvp-radio-text">
                                            {t.rsvp.yesOption}
                                        </span>
                                    </button>

                                    {/* No Card */}
                                    <button
                                        type="button"
                                        role="radio"
                                        aria-checked={attendance === "declined"}
                                        onClick={() => {
                                            setAttendance("declined");
                                            setGuestsCount("0");
                                            if (errorMessage) setErrorMessage(null);
                                        }}
                                        className={`rsvp-radio-card ${
                                            attendance === "declined"
                                                ? "rsvp-radio-card-active"
                                                : ""
                                        }`}
                                    >
                                        <Image
                                            src={`${RSVP_DIR}/radio_frame.png`}
                                            alt=""
                                            fill
                                            className="rsvp-frame-img"
                                            unoptimized
                                            priority
                                        />
                                        <span className="rsvp-radio-circle">
                                            {attendance === "declined" && (
                                                <span className="rsvp-radio-dot" />
                                            )}
                                        </span>
                                        <span className="rsvp-radio-text">
                                            {t.rsvp.noOption}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* 3. Number of Guests (Visible when Yes is selected) */}
                            {attendance === "attending" && (
                                <div className="rsvp-field rsvp-guests-field">
                                    <label
                                        htmlFor="rsvp-guests"
                                        className="rsvp-label"
                                    >
                                        {t.rsvp.guestsLabel}
                                    </label>
                                    <div className="rsvp-input-frame-box rsvp-number-input-frame-box">
                                        <Image
                                            src={`${RSVP_DIR}/input_frame.png`}
                                            alt=""
                                            fill
                                            className="rsvp-frame-img"
                                            unoptimized
                                        />
                                        <input
                                            id="rsvp-guests"
                                            type="number"
                                            min={1}
                                            max={20}
                                            placeholder={
                                                t.rsvp.guestsPlaceholder || "1"
                                            }
                                            value={guestsCount}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === "") {
                                                    setGuestsCount("");
                                                    if (errorMessage) setErrorMessage(null);
                                                    return;
                                                }
                                                const cleaned = val.replace(/[^0-9]/g, "");
                                                if (cleaned === "") {
                                                    setGuestsCount("");
                                                } else {
                                                    const num = parseInt(cleaned, 10);
                                                    setGuestsCount(String(Math.min(20, Math.max(1, num))));
                                                }
                                                if (errorMessage) setErrorMessage(null);
                                            }}
                                            className="rsvp-input rsvp-guests-input"
                                        />
                                        <div className="rsvp-stepper-arrows">
                                            <button
                                                type="button"
                                                className="rsvp-stepper-btn rsvp-stepper-up"
                                                onClick={handleIncrementGuests}
                                                aria-label="Increase guests"
                                                tabIndex={-1}
                                            >
                                                <svg
                                                    viewBox="0 0 10 6"
                                                    className="rsvp-stepper-icon"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M5 0.5L9.5 5.5H0.5L5 0.5Z" fill="currentColor" />
                                                </svg>
                                            </button>
                                            <button
                                                type="button"
                                                className="rsvp-stepper-btn rsvp-stepper-down"
                                                onClick={handleDecrementGuests}
                                                aria-label="Decrease guests"
                                                tabIndex={-1}
                                            >
                                                <svg
                                                    viewBox="0 0 10 6"
                                                    className="rsvp-stepper-icon"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M5 5.5L0.5 0.5H9.5L5 5.5Z" fill="currentColor" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 4. Message for the Couple */}
                            <div className="rsvp-field">
                                <label
                                    htmlFor="rsvp-message"
                                    className="rsvp-label"
                                >
                                    {t.rsvp.messageLabel}
                                </label>
                                <div className="rsvp-textarea-frame-box">
                                    <Image
                                        src={`${RSVP_DIR}/textarea_frame.png`}
                                        alt=""
                                        fill
                                        className="rsvp-frame-img"
                                        unoptimized
                                    />
                                    <textarea
                                        id="rsvp-message"
                                        rows={3}
                                        placeholder={t.rsvp.messagePlaceholder}
                                        value={message}
                                        onChange={(e) =>
                                            setMessage(e.target.value)
                                        }
                                        className="rsvp-textarea"
                                    />
                                </div>
                            </div>

                            {/* 5. Send Button */}
                            <div className="rsvp-btn-container">
                                <button
                                    type="submit"
                                    id="send-rsvp-btn"
                                    disabled={isLoading}
                                    className="rsvp-send-button"
                                >
                                    <Image
                                        src={`${RSVP_DIR}/send_button.png`}
                                        alt=""
                                        fill
                                        className="rsvp-send-btn-frame"
                                        unoptimized
                                        priority
                                    />
                                    <span className="rsvp-send-btn-label">
                                        {isLoading
                                            ? t.rsvp.submittingButton
                                            : `${t.rsvp.submitButton}`}
                                    </span>
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};
