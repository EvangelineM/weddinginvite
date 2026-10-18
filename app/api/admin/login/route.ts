import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const expectedUsername = (process.env.ADMIN_USERNAME || "admin").trim();
    const expectedPassword = (
      process.env.ADMIN_PASSWORD ||
      process.env.ADMIN_SECRET_KEY ||
      ""
    ).trim();

    if (!expectedPassword) {
      console.error("ADMIN_PASSWORD / ADMIN_SECRET_KEY not set in environment.");
      return NextResponse.json(
        { success: false, error: "Server authentication configuration error." },
        { status: 500 }
      );
    }

    const inputUser = typeof username === "string" ? username.trim() : "";
    const inputPass = typeof password === "string" ? password.trim() : "";

    // Secure constant-time or direct comparison
    if (inputUser !== expectedUsername || inputPass !== expectedPassword) {
      return NextResponse.json(
        { success: false, error: "Invalid username or password." },
        { status: 401 }
      );
    }

    const token = createSessionToken();

    const response = NextResponse.json({
      success: true,
      message: "Authenticated successfully.",
    });

    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (err: unknown) {
    console.error("Admin login error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
