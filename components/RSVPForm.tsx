"use client";

import React, { useState } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { TranslationContent } from "@/lib/translations";

const RSVP = "/images/rsvp";

interface RSVPFormProps {
    t: TranslationContent;
}

export const RSVPForm: React.FC<RSVPFormProps> = ({ t }) => {
    const [attendance, setAttendance] = useState<"attending" | "declined" | "">(
        "",
    );
    const [fullName, setFullName] = useState("");
    const [guestsCount, setGuestsCount] = useState<number>(1);
    const [message, setMessage] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
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

            try {
                confetti({
                    particleCount: 55,
                    spread: 65,
                    origin: { y: 0.65 },
                    colors: [
                        "#E3BDB0",
                        "#D28B77",
                        "#BD8167",
                        "#9F4B31",
                        "#FFFDFB",
                    ],
                });
            } catch {
                /* Safe fallback */
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
        setErrorMessage(null);
    };

    return (
        <section id="rsvp-section" className="rsvp-section">
            <div className="rsvp-artboard">
                {/* Background botanical frame image */}
                <Image
                    src={`${RSVP}/bg2.png`}
                    alt=""
                    fill
                    sizes="(max-width: 760px) 100vw, 760px"
                    className="rsvp-bg"
                    priority
                />

                {/* Content overlay */}
                <div className="rsvp-overlay">
                    {/* ══════════════ RSVP HEADING ══════════════ */}
                    <h2 className="rsvp-title">{t.rsvp.title}</h2>

                    {/* Small calligraphic ornament swirl (matching the reference) */}
                    <svg
                        className="rsvp-ornament"
                        viewBox="0 0 120 30"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path
                            d="M60 15 C52 8, 38 12, 38 18 C38 22, 44 24, 50 20 C56 16, 58 12, 60 15 C62 12, 64 16, 70 20 C76 24, 82 22, 82 18 C82 12, 68 8, 60 15Z"
                            stroke="#91482F"
                            strokeWidth="1.2"
                            fill="none"
                        />
                        <path
                            d="M36 18 C30 22, 22 20, 18 16"
                            stroke="#91482F"
                            strokeWidth="0.9"
                            fill="none"
                            strokeLinecap="round"
                        />
                        <path
                            d="M84 18 C90 22, 98 20, 102 16"
                            stroke="#91482F"
                            strokeWidth="0.9"
                            fill="none"
                            strokeLinecap="round"
                        />
                    </svg>

                    {/* ══════════════ TINY DIAMOND ORNAMENT ══════════════ */}
                    <div className="rsvp-tiny-diamond" aria-hidden="true">
                        <span />
                    </div>

                    {/* ══════════════ DEADLINE ══════════════ */}
                    <p className="rsvp-deadline">{t.rsvp.deadline}</p>

                    {/* ══════════════ SUCCESS STATE ══════════════ */}
                    {isSuccess ? (
                        <div className="rsvp-success">
                            <h3 className="rsvp-success-heading">
                                {t.rsvp.successHeading}
                            </h3>
                            <p className="rsvp-success-message">
                                {t.rsvp.successMessage}
                            </p>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="rsvp-success-reset"
                            >
                                {t.rsvp.sendAnother}
                            </button>
                        </div>
                    ) : (
                        /* ══════════════ FORM ══════════════ */
                        <form onSubmit={handleSubmit} className="rsvp-form">
                            {/* Error Banner */}
                            {errorMessage && (
                                <div className="rsvp-error">{errorMessage}</div>
                            )}

                            {/* ── Full name ── */}
                            <div className="rsvp-field">
                                <label
                                    htmlFor="rsvp-fullname"
                                    className="rsvp-label"
                                >
                                    {t.rsvp.nameLabel}
                                </label>
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

                            {/* Thin separator line */}
                            <div
                                className="rsvp-field-separator"
                                aria-hidden="true"
                            />

                            {/* ── Attendance (single row) ── */}
                            <div className="rsvp-attend-row">
                                <span className="rsvp-label rsvp-attend-label-inline">
                                    {t.rsvp.attendingQuestion}
                                </span>
                                <div className="rsvp-checkboxes-inline">
                                    <label className="rsvp-checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={attendance === "attending"}
                                            onChange={() =>
                                                setAttendance(
                                                    attendance === "attending"
                                                        ? ""
                                                        : "attending",
                                                )
                                            }
                                            className="rsvp-checkbox-hidden"
                                        />
                                        <span
                                            className={`rsvp-checkbox-box ${attendance === "attending" ? "rsvp-checkbox-checked" : ""}`}
                                        >
                                            {attendance === "attending" && (
                                                <svg
                                                    viewBox="0 0 16 16"
                                                    fill="none"
                                                    className="rsvp-checkmark"
                                                >
                                                    <path
                                                        d="M3 8.5L6.5 12L13 4"
                                                        stroke="#91482F"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            )}
                                        </span>
                                        <span className="rsvp-checkbox-text">
                                            {t.rsvp.yesOption}
                                        </span>
                                    </label>
                                    <label className="rsvp-checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={attendance === "declined"}
                                            onChange={() =>
                                                setAttendance(
                                                    attendance === "declined"
                                                        ? ""
                                                        : "declined",
                                                )
                                            }
                                            className="rsvp-checkbox-hidden"
                                        />
                                        <span
                                            className={`rsvp-checkbox-box ${attendance === "declined" ? "rsvp-checkbox-checked" : ""}`}
                                        >
                                            {attendance === "declined" && (
                                                <svg
                                                    viewBox="0 0 16 16"
                                                    fill="none"
                                                    className="rsvp-checkmark"
                                                >
                                                    <path
                                                        d="M3 8.5L6.5 12L13 4"
                                                        stroke="#91482F"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            )}
                                        </span>
                                        <span className="rsvp-checkbox-text">
                                            {t.rsvp.noOption}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* ── Number of guests (visible when attending) ── */}
                            {attendance === "attending" && (
                                <>
                                    <div
                                        className="rsvp-field-separator"
                                        aria-hidden="true"
                                    />
                                    <div className="rsvp-field rsvp-guests-field">
                                        <label className="rsvp-label">
                                            {t.rsvp.guestsLabel}
                                        </label>
                                        <div
                                            className="rsvp-guests-selector"
                                            role="radiogroup"
                                            aria-label={t.rsvp.guestsLabel}
                                        >
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <button
                                                    key={num}
                                                    type="button"
                                                    role="radio"
                                                    aria-checked={
                                                        guestsCount === num
                                                    }
                                                    onClick={() =>
                                                        setGuestsCount(num)
                                                    }
                                                    className={`rsvp-guest-pill ${guestsCount === num ? "rsvp-guest-pill-active" : ""}`}
                                                >
                                                    {num === 5 ? "5+" : num}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Thin separator line */}
                            <div
                                className="rsvp-field-separator"
                                aria-hidden="true"
                            />

                            {/* ── Message ── */}
                            <div className="rsvp-field">
                                <label
                                    htmlFor="rsvp-message"
                                    className="rsvp-label"
                                >
                                    {t.rsvp.messageLabel}
                                </label>
                                <textarea
                                    id="rsvp-message"
                                    rows={3}
                                    placeholder={t.rsvp.messagePlaceholder}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="rsvp-textarea"
                                />
                            </div>

                            {/* ── Send button with leaf flourishes ── */}
                            <div className="rsvp-btn-wrap">
                                {/* Left leaf branch */}
                                <svg
                                    className="rsvp-btn-leaf rsvp-btn-leaf-left"
                                    viewBox="0 0 60 20"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M55 10 C45 6, 35 4, 28 7 C21 10, 24 14, 30 13 C36 12, 42 8, 55 10Z"
                                        fill="#8C8964"
                                        fillOpacity="0.55"
                                    />
                                    <path
                                        d="M52 10 C44 8, 36 6, 28 9"
                                        stroke="#5E6241"
                                        strokeWidth="0.7"
                                        fill="none"
                                    />
                                    <path
                                        d="M48 12 C40 14, 30 16, 20 12 C14 10, 10 6, 6 10"
                                        stroke="#5E6241"
                                        strokeWidth="0.6"
                                        fill="none"
                                    />
                                    <circle
                                        cx="9"
                                        cy="8"
                                        r="1.8"
                                        fill="#D98F70"
                                        fillOpacity="0.45"
                                    />
                                    <circle
                                        cx="16"
                                        cy="6"
                                        r="1.2"
                                        fill="#C9795D"
                                        fillOpacity="0.35"
                                    />
                                </svg>

                                <button
                                    type="submit"
                                    id="send-rsvp-btn"
                                    disabled={isLoading}
                                    className="rsvp-send-btn"
                                >
                                    {isLoading
                                        ? t.rsvp.submittingButton
                                        : t.rsvp.submitButton}
                                </button>

                                {/* Right leaf branch */}
                                <svg
                                    className="rsvp-btn-leaf rsvp-btn-leaf-right"
                                    viewBox="0 0 60 20"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M5 10 C15 6, 25 4, 32 7 C39 10, 36 14, 30 13 C24 12, 18 8, 5 10Z"
                                        fill="#8C8964"
                                        fillOpacity="0.55"
                                    />
                                    <path
                                        d="M8 10 C16 8, 24 6, 32 9"
                                        stroke="#5E6241"
                                        strokeWidth="0.7"
                                        fill="none"
                                    />
                                    <path
                                        d="M12 12 C20 14, 30 16, 40 12 C46 10, 50 6, 54 10"
                                        stroke="#5E6241"
                                        strokeWidth="0.6"
                                        fill="none"
                                    />
                                    <circle
                                        cx="51"
                                        cy="8"
                                        r="1.8"
                                        fill="#D98F70"
                                        fillOpacity="0.45"
                                    />
                                    <circle
                                        cx="44"
                                        cy="6"
                                        r="1.2"
                                        fill="#C9795D"
                                        fillOpacity="0.35"
                                    />
                                </svg>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};
