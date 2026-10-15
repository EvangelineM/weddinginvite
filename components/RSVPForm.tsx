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
    const [guestsCount, setGuestsCount] = useState<number>(1);
    const [message, setMessage] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [lastSubmittedAttendance, setLastSubmittedAttendance] = useState<"attending" | "declined" | "">("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

        if (attendance === "attending" && (!guestsCount || guestsCount < 1)) {
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
                    guests_count: attendance === "attending" ? guestsCount : 0,
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
        setGuestsCount(1);
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
                        <h2 className="rsvp-title-text">{t.rsvp.title}</h2>
                    </div>

                    {/* ── Deadline Text Lines ── */}
                    <div className="rsvp-deadline-wrap">
                        <p className="rsvp-deadline-line">
                            {t.rsvp.deadlineLine1 || "KINDLY REPLY BEFORE"}
                        </p>
                        <p className="rsvp-deadline-line rsvp-deadline-date">
                            {t.rsvp.deadlineLine2 || "28 AUGUST 2026"}
                        </p>
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
                                <div className="rsvp-result-content">
                                    <p className="rsvp-declined-message">
                                        {t.rsvp.declinedMessage ||
                                            "Thank you for letting us know. You’ll be dearly missed! Sending love and blessings your way. 🤎"}
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
                                className="rsvp-reset-button"
                            >
                                {t.rsvp.sendAnother}
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
                                        onChange={(e) =>
                                            setFullName(e.target.value)
                                        }
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
                                        onClick={() => setAttendance("attending")}
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
                                            setGuestsCount(0);
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
                                    <div className="rsvp-input-frame-box">
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
                                            value={guestsCount || ""}
                                            onChange={(e) => {
                                                const val = parseInt(
                                                    e.target.value,
                                                    10,
                                                );
                                                setGuestsCount(
                                                    isNaN(val)
                                                        ? 1
                                                        : Math.max(1, Math.min(20, val)),
                                                );
                                            }}
                                            className="rsvp-input"
                                        />
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
                                            : `${t.rsvp.submitButton} >`}
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
