import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";
import { fetchAllRSVPs } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const headerKey = request.headers.get("x-admin-key");
    const configuredKey = process.env.ADMIN_SECRET_KEY || process.env.ADMIN_PASSWORD;

    const isTokenValid = verifySessionToken(token);
    const isHeaderValid = configuredKey && headerKey && headerKey === configuredKey;

    if (!isTokenValid && !isHeaderValid) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const { data, error } = await fetchAllRSVPs();

    if (error) {
      console.error("Error fetching RSVPs from database:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch RSVP records." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: unknown) {
    console.error("Admin RSVPs GET exception:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
