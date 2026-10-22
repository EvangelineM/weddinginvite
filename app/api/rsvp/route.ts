
import { NextRequest, NextResponse } from "next/server";
import {
  insertRSVP,
  fetchAllRSVPs,
  type RSVPInput,
} from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      full_name,
      attendance,
      guests_count,
      message,
    } = body;

    // Validate full name
    if (
      typeof full_name !== "string" ||
      full_name.trim().length < 2 ||
      full_name.trim().length > 120
    ) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid full name." },
        { status: 400 }
      );
    }

    // Validate attendance
    if (
      attendance !== "attending" &&
      attendance !== "declined"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Attendance must be attending or declined.",
        },
        { status: 400 }
      );
    }

    // Validate guest count
    const guestCount = Number(guests_count);

    if (
      !Number.isInteger(guestCount) ||
      (attendance === "attending" &&
        (guestCount < 1 || guestCount > 20)) ||
      (attendance === "declined" && guestCount !== 0)
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid number of guests." },
        { status: 400 }
      );
    }

    // Validate optional message
    if (
      message !== undefined &&
      message !== null &&
      typeof message !== "string"
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid message." },
        { status: 400 }
      );
    }

    const input: RSVPInput = {
      full_name: full_name.trim(),
      attendance,
      guests_count: guestCount,
      message:
        typeof message === "string" && message.trim()
          ? message.trim()
          : undefined,
    };

    const { data, error } = await insertRSVP(input);

    if (error) {
      console.error("RSVP insertion error:", error);

      return NextResponse.json(
        {
          success: false,
          error: "Failed to record RSVP. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "RSVP submitted successfully.",
      data,
    });
  } catch (err: unknown) {
    console.error("RSVP POST handler exception:", err);

    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const adminKey = request.headers.get("x-admin-key");
    const configuredKey = process.env.ADMIN_SECRET_KEY || process.env.ADMIN_PASSWORD;
    const cookieToken = request.cookies.get("wedding_admin_session")?.value;

    const { verifySessionToken } = await import("@/lib/adminAuth");
    const isSessionValid = verifySessionToken(cookieToken);
    const isKeyValid = configuredKey && adminKey && adminKey === configuredKey;

    if (!isSessionValid && !isKeyValid) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { data, error } = await fetchAllRSVPs();

    if (error) {
      console.error("RSVP fetch error:", error);

      return NextResponse.json(
        { success: false, error: "Failed to fetch RSVPs." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: unknown) {
    console.error("RSVP GET handler exception:", err);

    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
