import { NextRequest, NextResponse } from 'next/server';
import { insertRSVP, fetchAllRSVPs, RSVPInput } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { full_name, email, attendance, dietary_requirements, message } = body;

    // Validation
    if (!full_name || typeof full_name !== 'string' || !full_name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Full name is required.' },
        { status: 400 }
      );
    }

    if (!attendance || (attendance !== 'attending' && attendance !== 'declined')) {
      return NextResponse.json(
        { success: false, error: 'Attendance status must be attending or declined.' },
        { status: 400 }
      );
    }

    // Email validation if provided
    if (email && typeof email === 'string' && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return NextResponse.json(
          { success: false, error: 'Please enter a valid email address.' },
          { status: 400 }
        );
      }
    }

    const input: RSVPInput = {
      full_name: full_name.trim(),
      email: email ? email.trim() : undefined,
      attendance,
      dietary_requirements: dietary_requirements ? dietary_requirements.trim() : undefined,
      message: message ? message.trim() : undefined,
    };

    const { data, error } = await insertRSVP(input);

    if (error) {
      console.error('RSVP insertion error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to record RSVP. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'RSVP submitted successfully.',
      data,
    });
  } catch (err: unknown) {
    console.error('RSVP POST handler exception:', err);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const adminKey = request.headers.get('x-admin-key') || request.nextUrl.searchParams.get('key');
    const configuredKey = process.env.ADMIN_SECRET_KEY || 'chateau2026';

    if (!adminKey || adminKey !== configuredKey) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid admin key.' },
        { status: 401 }
      );
    }

    const { data, error } = await fetchAllRSVPs();

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch RSVPs.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: unknown) {
    console.error('RSVP GET handler exception:', err);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
