import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface RSVPRecord {
  id: string;
  full_name: string;
  email: string | null;
  attendance: 'attending' | 'declined';
  dietary_requirements: string | null;
  message: string | null;
  created_at: string;
}

export type RSVPInput = {
  full_name: string;
  email?: string;
  attendance: 'attending' | 'declined';
  dietary_requirements?: string;
  message?: string;
};

// Check if valid Supabase credentials exist
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isConfigured = 
  supabaseUrl.startsWith('http') && 
  !supabaseUrl.includes('your-project') &&
  supabaseKey.length > 10;

let serverSupabaseClient: SupabaseClient | null = null;
if (isConfigured) {
  serverSupabaseClient = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });
}

// Global in-memory / local fallback cache for development or when Supabase keys are not yet configured
declare global {
  // eslint-disable-next-line no-var
  var __mock_rsvps__: RSVPRecord[] | undefined;
}

if (!global.__mock_rsvps__) {
  global.__mock_rsvps__ = [
    {
      id: 'demo-1',
      full_name: 'Lady Danbury',
      email: 'danbury@mayfair.co.uk',
      attendance: 'attending',
      dietary_requirements: 'Strictly Earl Grey & delicate cucumber sandwiches',
      message: 'Dearest Irene & Franklin, an invitation of such supreme elegance could never be refused!',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'demo-2',
      full_name: 'Viscount Anthony Bridgerton',
      email: 'anthony@bridgertonhouse.co.uk',
      attendance: 'attending',
      dietary_requirements: 'None',
      message: 'Warmest congratulations to you both. Looking forward to celebrating in France.',
      created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      id: 'demo-3',
      full_name: 'Lord Featherington',
      email: 'featherington@london.co.uk',
      attendance: 'declined',
      dietary_requirements: '',
      message: 'Regretfully away on estate business. Wishing you a lifetime of joy and happiness!',
      created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
  ];
}

export async function insertRSVP(input: RSVPInput): Promise<{ data: RSVPRecord | null; error: string | null }> {
  try {
    if (serverSupabaseClient) {
      const { data, error } = await serverSupabaseClient
        .from('rsvps')
        .insert([
          {
            full_name: input.full_name.trim(),
            email: input.email ? input.email.trim().toLowerCase() : null,
            attendance: input.attendance,
            dietary_requirements: input.dietary_requirements ? input.dietary_requirements.trim() : null,
            message: input.message ? input.message.trim() : null,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        return { data: null, error: error.message };
      }

      return { data: data as RSVPRecord, error: null };
    }

    // Fallback store
    const newRecord: RSVPRecord = {
      id: `rsvp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      full_name: input.full_name.trim(),
      email: input.email ? input.email.trim().toLowerCase() : null,
      attendance: input.attendance,
      dietary_requirements: input.dietary_requirements ? input.dietary_requirements.trim() : null,
      message: input.message ? input.message.trim() : null,
      created_at: new Date().toISOString(),
    };

    global.__mock_rsvps__ = [newRecord, ...(global.__mock_rsvps__ || [])];
    return { data: newRecord, error: null };
  } catch (err: unknown) {
    console.error('Error inserting RSVP:', err);
    return { data: null, error: err instanceof Error ? err.message : 'Unknown server error' };
  }
}

export async function fetchAllRSVPs(): Promise<{ data: RSVPRecord[]; error: string | null }> {
  try {
    if (serverSupabaseClient) {
      const { data, error } = await serverSupabaseClient
        .from('rsvps')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error);
        return { data: global.__mock_rsvps__ || [], error: error.message };
      }

      return { data: (data as RSVPRecord[]) || [], error: null };
    }

    return { data: global.__mock_rsvps__ || [], error: null };
  } catch (err: unknown) {
    console.error('Error fetching RSVPs:', err);
    return { data: global.__mock_rsvps__ || [], error: err instanceof Error ? err.message : 'Unknown server error' };
  }
}
