
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export interface RSVPRecord {
  id: number;
  full_name: string;
  attendance: "attending" | "declined";
  guests_count: number;
  message: string | null;
  created_at: string;
}

export type RSVPInput = {
  full_name: string;
  attendance: "attending" | "declined";
  guests_count: number;
  message?: string;
};

function createSupabaseClient(
  key: string | undefined
): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!url || !url.startsWith("https://") || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// Public submissions use the publishable/anon key or server admin client.
const publicSupabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Admin operations use a server-only secret, never exposed to client.
const adminSupabase = createSupabaseClient(
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function insertRSVP(
  input: RSVPInput
): Promise<{ data: RSVPRecord | null; error: string | null }> {
  // Use admin client on the server to ensure insertion succeeds with Supabase RLS
  const client = adminSupabase || publicSupabase;

  if (!client) {
    return {
      data: null,
      error: "Supabase is not configured. Check your environment variables.",
    };
  }

  try {
    const { data, error } = await client
      .from("wedding_rsvps")
      .insert({
        full_name: input.full_name.trim(),
        attendance: input.attendance,
        guests_count: input.guests_count,
        message: input.message?.trim() || null,
      })
      .select("id, full_name, attendance, guests_count, message, created_at")
      .single();

    if (error) {
      console.error("Supabase RSVP insert error:", error.message);
      return { data: null, error: error.message };
    }

    return { data: data as RSVPRecord, error: null };
  } catch (err: unknown) {
    console.error("RSVP insertion failed:", err);

    return {
      data: null,
      error: err instanceof Error ? err.message : "Unknown server error",
    };
  }
}

export async function fetchAllRSVPs(): Promise<{
  data: RSVPRecord[];
  error: string | null;
}> {
  if (!adminSupabase) {
    return {
      data: [],
      error: "Admin database access is not configured.",
    };
  }

  try {
    const { data, error } = await adminSupabase
      .from("wedding_rsvps")
      .select("id, full_name, attendance, guests_count, message, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase RSVP fetch error:", error.message);
      return { data: [], error: error.message };
    }

    return { data: (data ?? []) as RSVPRecord[], error: null };
  } catch (err: unknown) {
    console.error("RSVP fetch failed:", err);

    return {
      data: [],
      error: err instanceof Error ? err.message : "Unknown server error",
    };
  }
}
